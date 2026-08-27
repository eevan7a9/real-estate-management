import { Enquiry } from "../../models/enquiry.js";
import { Property } from "../../models/property.js";
import { v4 as uuidV4 } from "uuid";
import { User } from "../../models/user.js";
import { sendTargetedNotification } from "../../websocket/index.js";
import { SocketNotificationType } from "../../enums/notifications.js";
import { addActivity } from "../../services/activity.js";
import { ActivityType } from "../../enums/activity.js";
import { EnquiryTopic } from "../../enums/enquiries.js";
import { activityEnquiryDescription } from "../../utils/activity/index.js";

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
const validTopics = new Set(Object.values(EnquiryTopic));

export const createEnquiry = async function (req, res) {
  const { title, content, topic, email, userTo, property, replyTo } =
    req.body || {};
  const userFrom = req.user.id;

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof topic !== "string" ||
    typeof email !== "string" ||
    typeof userTo !== "string" ||
    !property?.property_id
  ) {
    return res
      .status(400)
      .send({ message: "Error: Required enquiry fields are missing." });
  }
  if (
    title.trim().length < 1 ||
    content.trim().length < 10 ||
    content.trim().length > 1000 ||
    !isEmail(email) ||
    !validTopics.has(topic)
  ) {
    return res
      .status(400)
      .send({ message: "Error: Enquiry details are invalid." });
  }
  if (userFrom === userTo) {
    return res
      .status(400)
      .send({ message: "Not allowed to send an enquiry to yourself." });
  }

  try {
    const users = await User.find({ user_id: { $in: [userFrom, userTo] } });
    if (users.length !== 2) {
      return res
        .status(404)
        .send({ message: "Error: Target user was not found." });
    }

    let propertySnapshot;
    let replySnapshot;
    if (replyTo?.enquiry_id) {
      const original = await Enquiry.findOne({
        enquiry_id: replyTo.enquiry_id,
        $or: [
          {
            "users.from.user_id": userFrom,
            "users.from.keep": true,
            "users.to.user_id": userTo,
          },
          {
            "users.from.user_id": userTo,
            "users.to.user_id": userFrom,
            "users.to.keep": true,
          },
        ],
      });
      if (
        !original ||
        original.property?.property_id !== property.property_id
      ) {
        return res
          .status(404)
          .send({ message: "Error: Original enquiry was not found." });
      }
      propertySnapshot = {
        property_id: original.property.property_id,
        name: original.property.name,
      };
      replySnapshot = {
        enquiry_id: original.enquiry_id,
        title: original.title,
        topic: original.topic,
      };
    } else {
      const foundProperty = await Property.findOne({
        property_id: property.property_id,
        isActive: true,
      });
      if (!foundProperty || foundProperty.user_id !== userTo) {
        return res
          .status(404)
          .send({ message: "Error: Property was not found." });
      }
      propertySnapshot = {
        property_id: foundProperty.property_id,
        name: foundProperty.name,
      };
    }

    const newEnquiry = await new Enquiry({
      enquiry_id: uuidV4(),
      content: content.trim(),
      email: email.trim().toLowerCase(),
      title: title.trim(),
      topic,
      read: false,
      property: propertySnapshot,
      ...(replySnapshot && { replyTo: replySnapshot }),
      users: {
        from: { user_id: userFrom, keep: true },
        to: { user_id: userTo, keep: true },
      },
    }).save();

    const sender = users.find((user) => user.user_id === userFrom);
    const activity = addActivity(sender, {
      action: ActivityType.enquiry.new,
      description: activityEnquiryDescription(
        ActivityType.enquiry.new,
        newEnquiry,
      ),
      enquiry_id: newEnquiry.enquiry_id,
    });
    await sender.save();

    sendTargetedNotification(
      SocketNotificationType.activity,
      activity,
      userFrom,
    );
    sendTargetedNotification(
      SocketNotificationType.enquiry,
      newEnquiry,
      userTo,
    );

    return res.status(201).send({ data: newEnquiry });
  } catch (error) {
    req.log.error({ err: error }, "Enquiry creation failed");
    return res
      .status(500)
      .send({ message: "Error: Unable to create enquiry." });
  }
};
