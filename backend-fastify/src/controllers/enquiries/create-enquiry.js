import { Enquiry } from "../../models/enquiry.js";
import { v4 as uuidV4 } from "uuid";
import { User } from "../../models/user.js";
import { sendTargetedNotification } from "../../websocket/index.js";
import { SocketNotificationType } from "../../enums/notifications.js";
import { addActivity } from "../../services/activity.js";
import { ActivityType } from "../../enums/activity.js";
import { activityEnquiryDescription } from "../../utils/activity/index.js";

/**
 * Creates an enquiry.
 * @param {import('fastify').FastifyRequest} req - The Fastify request object.
 * @param {import('fastify').FastifyReply} res - The Fastify reply object.
 */
export const createEnquiry = async function (req, res) {
  const { title, content, topic, email, userTo, property } = req.body;
  if (!title || !content || !topic || !email || !userTo) {
    return res.status(400).send({ message: "Some fields are missing!" });
  }
  const userFrom = req.user.id;

  if (userFrom === userTo) {
    return res
      .status(400)
      .send({ message: "Not allowed to send enquiry to yourself." });
  }

  // const targetUser = await User.findOne({ user_id: userTo });
  const users = await User.find({ $or: [{user_id: userFrom}, { user_id: userTo}]});
  if (users.length < 2) {
    return res.status(404).send({ message: "Target users are not found." });
  }
  try {
    const newEnquiry = new Enquiry({
      enquiry_id: uuidV4(),
      read: false,
      users: {
        from: { user_id: userFrom, keep: true },
        to: { user_id: userTo, keep: true },
      },
      property,
      ...req.body,
    });
    await newEnquiry.save();

    // We Log User activity
    const user = users.find((item) => item.user_id === userFrom);
    const activity = addActivity(user, {
      action: ActivityType.enquiry.new,
      description: activityEnquiryDescription(ActivityType.enquiry.new, newEnquiry),
      enquiry_id: newEnquiry.enquiry_id,
    })
    await user.save();

    // Send Websocket Notification to update User activity.
    if (activity) {
      sendTargetedNotification(SocketNotificationType.activity, activity, userFrom);
    }
    // Send Enquiry notification to Intended User.
    sendTargetedNotification(SocketNotificationType.enquiry, newEnquiry, userTo);

    res.status(201).send({ data: newEnquiry });
    return;
  } catch (error) {
    return res.status(400).send(error);
  }
};
