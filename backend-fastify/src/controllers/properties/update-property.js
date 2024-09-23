import { ActivityType } from "../../enums/activity.js";
import { SocketNotificationType } from "../../enums/notifications.js";
import { Property } from "../../models/property.js";
import { User } from "../../models/user.js";
import { addActivity } from "../../services/activity.js";
import { activityPropertyDescription } from "../../utils/activity/index.js";
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
    const user_id = req.user.id;
    const options = { useFindAndModify: false, new: true, runValidators: true };

    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).send({ message: "Error: User not found." });
    }
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
    const activity = addActivity(user, {
      action: ActivityType.property.update,
      description: activityPropertyDescription(
        ActivityType.property.update,
        property
      ),
      property_id: property.property_id,
    });
    await user.save();
    if (activity) {
      sendTargetedNotification(
        SocketNotificationType.activity,
        activity,
        user_id
      );
    }

    return res.status(201).send({
      data: { ...property.toObject() },
      message: "Success: Property is updated.",
    });
  } catch (error) {
    return res.send(error);
  }
};
