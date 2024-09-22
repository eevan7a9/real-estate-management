import { v4 as uuidv4 } from "uuid";

/**
 * @typedef {Object} User
 * @property {string} user_id
 * @property {string} fullName
 * @property {string} email
 * @property {Array} [properties]
 * @property {Array} [activities]
 * @property {Array} [notifications]
 */

/**
 * @typedef {Object} Notification
 * @property {string} message
 * @property {string} type
 * @property {Date} [expiresAt]
 * @property {Date} [createdAt]
 */

/**
 * Removes expired notifications from the user's notifications array
 * @param {User} user - The user document
 * @returns {boolean} returns 'true' if one or more notification was removed
 */
export const removeExpiredNotifications = function (user) {
  const originalSize = user.notifications.length;
  const now = new Date();
  user.notifications = user.notifications.filter(
    (notification) => notification.expiresAt > now
  );
  // console.log("\n Original Size:" + originalSize + "\n Current Size : " + user.notifications.length);
  return originalSize != user.notifications.length;
};

/**
 * Adds a new notification to the user and manages the notification list size.
 * @param {User} user
 * @param {Notification} notification
 */
export const addNotification = function (user, notification) {
  if (!user) {
    throw new Error("Error: User not found!");
  }
  if (user.notifications.length) {
    removeExpiredNotifications(user);
  }
  const maxNotification = Number(process.env.USER_NOTIFICATIONS_MAX) || 20;
  if (user.notifications?.length >= maxNotification) {
    user.notifications.pop();
  }
  notification.notification_id = uuidv4();
  notification.createdAt = new Date();

  // 7 day | Default
  notification.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  // 3 min | for testing
  // notification.expiresAt = new Date(Date.now() + 3 * 60 * 1000);
  user.notifications.unshift(notification);
  return notification;
};
