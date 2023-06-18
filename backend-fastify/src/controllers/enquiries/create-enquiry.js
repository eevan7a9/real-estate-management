import { Enquiry } from "../../models/enquiry.js";
import { v4 as uuidV4 } from "uuid";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";
import { User } from "../../models/user.js";
import { sendTargetedNotification } from "../../websocket/index.js";
import { EnquiryNotification } from "../../enums/enquiries.js";

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
    return res.status(400).send({ message: "Not allowed to send enquiry to yourself." });
  }

  const targetUser = await User.findOne({ user_id: userTo });
  if (!targetUser) {
    return res.status(400).send({ message: "Target user not found." });
  }

  const users = {
    from: { user_id: userFrom, keep: true },
    to: { user_id: userTo, keep: true }
  }

  try {
    const newEnquiry = new Enquiry({
      enquiry_id: uuidV4(),
      read: false,
      users,
      property,
      ...req.body,
    });
    await newEnquiry.save();
    res.status(201).send({ data: newEnquiry });
    sendTargetedNotification(EnquiryNotification.new, newEnquiry, userTo);
  } catch (error) {
    res.status(400).send(error);
  }
};
