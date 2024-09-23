import { ActivityType } from "../../enums/activity.js";
import { SocketNotificationType } from "../../enums/notifications.js";
import { Property } from "../../models/property.js";
import { User } from "../../models/user.js";
import { addActivity } from "../../services/activity.js";
import { activityPropertyDescription } from "../../utils/activity/index.js";
import { sendTargetedNotification } from "../../websocket/index.js";
import { unlinkImages } from "./image-property.js";

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 */
export const deleteProperty = async function (req, res) {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).send({ message: "Error: User not found." });
    }
    const property = await Property.findOneAndDelete({
      property_id: id,
      user_id,
    });
    if (!property) {
      return res.status(404).send({});
    }
    if (property.images?.length) {
      unlinkImages(property.images);
    }

    // We Log User activity
    user.properties = user.properties.filter((i) => i !== id);
    const activity = addActivity(user, {
      action: ActivityType.property.delete,
      description: activityPropertyDescription(
        ActivityType.property.delete,
        property
      ),
      property_id: id,
    });
    await user.save();

    if (activity) {
      sendTargetedNotification(
        SocketNotificationType.activity,
        activity,
        user_id
      );
    }
    return res.status(200).send({ data: { ...property.toObject() } });
  } catch (error) {
    return res.send(error);
  }
};
