import { ActivityType } from "../../enums/activity.js";
import { NotificationType } from "../../enums/notifications.js";
import { Property } from "../../models/property.js";
import { User } from "../../models/user.js";
import { createActivity } from "../../services/activity.js";
import { activityPropertyDescription } from "../../utils/activity/index.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";
import { sendTargetedNotification } from "../../websocket/index.js";
import { unlinkImages } from "./image-property.js";

export const deleteProperty = async function (req, res) {
  const { id } = req.params;
  try {
    const token = authBearerToken(req);
    const user_id = userIdToken(token);
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
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).send({ message: "Error: User not found" });
    }
    user.properties = user.properties.filter((i) => i !== property.property_id);
    user.save();

    // We Log User activity
    const activity = await createActivity({
      action: ActivityType.property.delete,
      description: activityPropertyDescription(
        ActivityType.property.delete,
        property
      ),
      user_id,
    });
    if (activity) {
      sendTargetedNotification(NotificationType.activity, activity, user_id);
    }
    return res.status(200).send({ data: { ...property.toObject() } });
  } catch (error) {
    return res.send(error);
  }
};
