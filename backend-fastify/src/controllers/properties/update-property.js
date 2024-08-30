import { ActivityType } from "../../enums/activity.js";
import { NotificationType } from "../../enums/notifications.js";
import { Property } from "../../models/property.js";
import { createActivity } from "../../services/activity.js";
import { activityPropertyDescription } from "../../utils/activity/index.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";
import { sendTargetedNotification } from "../../websocket/index.js";

export const updateProperty = async function (req, res) {
  const property_id = req.params.id;
  if (!property_id) {
    res.status(404).send({ message: "Error: Can't update unknown property" });
  }
  const {
    name,
    address,
    description,
    type,
    position,
    price,
    paymentFrequency,
    features,
    currency,
    contactNumber,
    transactionType,
    contactEmail,
  } = req.body;

  const $set = {
    // Fields to update
    ...(name !== undefined && { name }),
    ...(address !== undefined && { address }),
    ...(description !== undefined && { description }),
    ...(type !== undefined && { type }),
    ...(transactionType !== undefined && { transactionType }),
    ...(position !== undefined && { position }),
    ...(price !== undefined && { price }),
    ...(paymentFrequency !== undefined && { paymentFrequency }),
    ...(features !== undefined && { features }),
    ...(currency !== undefined && { currency }),
    ...(contactNumber !== undefined && { contactNumber }),
    ...(contactEmail !== undefined && {
      contactEmail: contactEmail.toLowerCase(),
    }),
  };
  try {
    const token = authBearerToken(req);
    const user_id = userIdToken(token);
    const options = { useFindAndModify: false, new: true, runValidators: true };
    const property = await Property.findOneAndUpdate(
      { property_id, user_id },
      { $set },
      options
    );
    if (!property) {
      return res
        .status(404)
        .send({ message: "Error: Can't update unknown property" });
    }

    // We Log User activity
    const activity = await createActivity({
      action: ActivityType.property.update,
      description: activityPropertyDescription(
        ActivityType.property.update,
        property
      ),
      user_id,
      property_id: property.property_id,
    });
    if (activity) {
      sendTargetedNotification(NotificationType.activity, activity, user_id);
    }

    return res.status(201).send({
      data: { ...property.toObject() },
      message: "Success: Property is updated.",
    });
  } catch (error) {
    return res.send(error);
  }
};
