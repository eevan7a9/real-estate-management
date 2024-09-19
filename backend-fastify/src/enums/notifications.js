/**
 * Socket Notification Type
 * To identify type of notification for websocket to send.
 */
export const SocketNotificationType = {
  activity: "ACTIVITY",
  enquiry: "ENQUIRY",
  logout: "USER_LOGOUT",
  user: "USER"
};

Object.freeze(SocketNotificationType);

export const NotificationType = {
  account: "ACCOUNT", 
  enquiry: "ENQUIRY", 
  property: "PROPERTY", 
  system: "SYSTEM"
};

Object.freeze(NotificationType);