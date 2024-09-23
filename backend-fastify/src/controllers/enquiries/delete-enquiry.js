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
    const enquiry = await Enquiry.findOne({ enquiry_id: id });
    if (!enquiry) {
      return res.status(404).send({});
    }
    if (
      enquiry.users.from.user_id !== user_id &&
      enquiry.users.to.user_id !== user_id
    ) {
      return res.status(400).send({ message: "Not allowed." });
    }
    if (enquiry.users.from.user_id === user_id) {
      enquiry.users.from.keep = false;
    }
    if (enquiry.users.to.user_id === user_id) {
      enquiry.users.to.keep = false;
    }
    if (!enquiry.users.from.keep && !enquiry.users.to.keep) {
      // if both sender & receiver have deleted the message
      await enquiry.delete();
    } else {
      await enquiry.save();
    }

    // We Log User activity
    const user = await User.findOne({ user_id });
    const activity = addActivity(user, {
      action: ActivityType.enquiry.new,
      description: activityEnquiryDescription(
        ActivityType.enquiry.delete,
        enquiry
      ),
    });
    await user.save();

    // Send Websocket Notification to update User activity.
    if (activity) {
      sendTargetedNotification(
        SocketNotificationType.activity,
        activity,
        user_id
      );
    }
    return res.status(200).send({ data: enquiry });
  } catch (error) {
    return res.status(400).send(error);
  }
};
