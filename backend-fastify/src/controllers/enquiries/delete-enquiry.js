import { ActivityType } from "../../enums/activity.js";
import { NotificationType } from "../../enums/notifications.js";
import { Enquiry } from "../../models/enquiry.js";
import { createActivity } from "../../services/activity.js";
import { activityEnquiryDescription } from "../../utils/activity/index.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";
import { sendTargetedNotification } from "../../websocket/index.js";

export const deleteEnquiry = async function (req, res) {
  const { id } = req.params;
  const token = authBearerToken(req);
  const user_id = userIdToken(token);

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
    const activity = await createActivity({
      action: ActivityType.enquiry.new,
      description: activityEnquiryDescription(
        ActivityType.enquiry.delete,
        enquiry
      ),
      user_id,
    });
    if (activity) {
      // Send Websocket Notification to update User activity.
      sendTargetedNotification(NotificationType.activity, activity, user_id);
    }

    return res.status(200).send({ data: enquiry });
  } catch (error) {
    return res.status(400).send(error);
  }
};
