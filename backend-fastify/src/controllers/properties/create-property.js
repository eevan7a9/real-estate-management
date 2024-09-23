import { v4 as uuidv4 } from "uuid";
import { Property } from "../../models/property.js";
import { User } from "../../models/user.js";
import { addActivity } from "../../services/activity.js";
import { activityPropertyDescription } from "../../utils/activity/index.js";
import { sendTargetedNotification } from "../../websocket/index.js";
import { ActivityType } from "../../enums/activity.js";
import { SocketNotificationType } from "../../enums/notifications.js";

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 * @returns
 */
export const createProperty = async function (req, res) {
  const { name, address, type, position } = req.body;
  if (!name || !address || !type || !position) {
    res.status(400).send({ message: "Error: Required fields are missing." });
    return;
  }
  const user_id = req.user.id;

  try {
    const newProperty = new Property({
      property_id: uuidv4(),
      user_id,
      ...req.body,
    });
    const user = await User.findOne({ user_id });
    if(!user) {
      return res.status(404).send({ message: "Error: User not found." });
    }
    // We Log User activity
    const activity = addActivity(user, {
      action: ActivityType.property.new,
      description: activityPropertyDescription(
        ActivityType.property.new,
        newProperty
      ),
      property_id: newProperty.property_id,
    });
    user.properties.push(newProperty.property_id);
    await user.save();

    if (activity) {
      sendTargetedNotification(SocketNotificationType.activity, activity, user_id);
    }
    await newProperty.save();
    return res.status(201).send({ data: newProperty });
  } catch (error) {
    return res.send(error);
  }
};
