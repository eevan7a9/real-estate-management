import { ActivityType } from "../../enums/activity.js";
import { SocketNotificationType } from "../../enums/notifications.js";
import { Enquiry } from "../../models/enquiry.js";
import { User } from "../../models/user.js";
import { addActivity } from "../../services/activity.js";
import { activityEnquiryDescription } from "../../utils/activity/index.js";
import { sendTargetedNotification } from "../../websocket/index.js";

export const deleteEnquiry = async function (req, res) {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const enquiry = await Enquiry.findOne({
      enquiry_id: id,
      $or: [
        { "users.from.user_id": user_id, "users.from.keep": true },
        { "users.to.user_id": user_id, "users.to.keep": true },
      ],
    });
    if (!enquiry) {
      return res.status(404).send({ message: "Error: Can not find enquiry." });
    }

    if (enquiry.users.from.user_id === user_id) {
      enquiry.users.from.keep = false;
    } else {
      enquiry.users.to.keep = false;
    }

    if (!enquiry.users.from.keep && !enquiry.users.to.keep) {
      await enquiry.deleteOne();
    } else {
      await enquiry.save();
    }

    const user = await User.findOne({ user_id });
    if (user) {
      const activity = addActivity(user, {
        action: ActivityType.enquiry.delete,
        description: activityEnquiryDescription(
          ActivityType.enquiry.delete,
          enquiry,
        ),
        enquiry_id: enquiry.enquiry_id,
      });
      await user.save();
      sendTargetedNotification(
        SocketNotificationType.activity,
        activity,
        user_id,
      );
    }

    return res.status(200).send({ data: enquiry });
  } catch (error) {
    req.log.error({ err: error }, "Enquiry deletion failed");
    return res
      .status(500)
      .send({ message: "Error: Unable to delete enquiry." });
  }
};
