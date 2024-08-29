import { Enquiry } from "../../models/enquiry.js";
import { v4 as uuidV4 } from "uuid";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";
import { User } from "../../models/user.js";
import { sendTargetedNotification } from "../../websocket/index.js";
import { NotificationType } from "../../enums/notifications.js";
import { createActivity } from "../../services/activity.js";
import { ActivityType } from "../../enums/activity.js";
import { activityEnquiryDescription } from "../../utils/activity.js";

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

  const token = authBearerToken(req);
  const userFrom = userIdToken(token);

  if (userFrom === userTo) {
    return res
      .status(400)
      .send({ message: "Not allowed to send enquiry to yourself." });
  }

  const targetUser = await User.findOne({ user_id: userTo });
  if (!targetUser) {
    return res.status(400).send({ message: "Target user not found." });
  }

  const users = {
    from: { user_id: userFrom, keep: true },
    to: { user_id: userTo, keep: true },
  };

  try {
    const newEnquiry = new Enquiry({
      enquiry_id: uuidV4(),
      read: false,
      users,
      property,
      ...req.body,
    });
    await newEnquiry.save();

    // We Log User activity
    const activity = await createActivity({
      action: ActivityType.enquiry.new,
      description: activityEnquiryDescription(ActivityType.enquiry.new, newEnquiry),
      user_id: userFrom,
      enquiry_id: newEnquiry.enquiry_id,
    });
    if (activity) {
      // Send Websocket Notification to update User activity.
      sendTargetedNotification(NotificationType.activity, activity, userFrom);
    }
    // Send Enquiry notification to Intended User.
    sendTargetedNotification(NotificationType.enquiry, newEnquiry, userTo);

    res.status(201).send({ data: newEnquiry });
    return;
  } catch (error) {
    return res.status(400).send(error);
  }
};
