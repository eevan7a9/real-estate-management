import { ActivityType } from "../../enums/activity.js";
import { NotificationType, SocketNotificationType } from "../../enums/notifications.js";
import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import { addActivity } from "../../services/activity.js";
import { addNotification } from "../../services/notification.js";
import { isPasswordValid } from "../../utils/users.js";
import { sendTargetedNotification } from "../../websocket/index.js";

export const changePassword = async function (req, res) {
  const { passwordCurrent, passwordNew } = req.body;
  if (!passwordCurrent) return res.status(400).send({ message: "Error: form is invalid, current password is missing" });
  else if (!passwordNew) return res.status(400).send({ message: "Error: form is invalid, new password is missing" });
  else if (passwordCurrent === passwordNew) return res.status(400).send({
    message: "Error: new password cannot be the same as your current password. Please choose a different password"
  });

  const user_id = req.user.id;

  try {
    const foundUser = await User.findOne({ user_id });
    if (!foundUser) {
      return res.status(404).send({
        statusCode: 404,
        message: "Error: We can't find the user.",
      });
    }

    const validPasswordCurrent = await fastify.bcrypt.compare(passwordCurrent, foundUser.password);
    if (!validPasswordCurrent) {
      return res.status(400).send({ message: "Error: Current password is not valid." });
    }

    if (!isPasswordValid(passwordNew)) {
      return res.status(400).send({ message: "Error: New password is not valid." });
    }

    const hashedPassword = await fastify.bcrypt.hash(passwordNew);
    foundUser.password = hashedPassword;
    // Add notification
    const notification = addNotification(foundUser, {
      type: NotificationType.account,
      message: "Your account password has been successfully updated.",
    });
    sendTargetedNotification(SocketNotificationType.user, notification, user_id);

    // Add activity
    addActivity(foundUser, {
      action: ActivityType.user.update,
      description: "You changed your account password.",
    });
    await foundUser.save();

    return res.status(200).send({});
  } catch (error) {
    return res.status(400).send({ message: "Error: Something went wrong." });
  }
};
