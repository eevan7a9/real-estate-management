export const ActivityType = {
  // Enquiry
  enquiry: {
    new: "ENQUIRY_NEW",
    delete: "ENQUIRY_DELETE",
  },
  // Property
  property: {
    new: "PROPERTY_NEW",
    delete: "PROPERTY_DELETE",
    update: "PROPERTY_UPDATE",
  },
  // User
  user: {
    login: "USER_LOGIN",
    logout: "USER_LOGOUT",
    register: "USER_REGISTER",
    update: "USER_UPDATE",
  },
};

Object.freeze(ActivityType);
