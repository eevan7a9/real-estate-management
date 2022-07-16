// multiple users
export const usersProperties = {
  user_id: { type: "string" },
  email: { type: "string" },
  fullName: { type: "string" },
};
Object.freeze(usersProperties);

// single user
export const userProperties = {
  ...usersProperties,
  properties: {
    type: "array"
  }
};

// single user current user
export const meProperties = {
  ...userProperties,
  enquiries: {
    type: "array"
  }
};
Object.freeze(userProperties);