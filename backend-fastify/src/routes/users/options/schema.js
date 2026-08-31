// Fields safe to return for a user in a list.
export const userProperties = {
  user_id: { type: "string" },
  fullName: { type: "string" },
  about: { type: "string" },
  profileImage: { type: "string" },
};
Object.freeze(userProperties);

const publicLocationProperties = {
  city: { type: "string" },
  region: { type: "string" },
  country: { type: "string" },
};
Object.freeze(publicLocationProperties);

const publicLinkProperties = {
  website: { type: "string" },
  facebook: { type: "string" },
  instagram: { type: "string" },
  linkedin: { type: "string" },
  x: { type: "string" },
  youtube: { type: "string" },
  tiktok: { type: "string" },
};
Object.freeze(publicLinkProperties);

const publicPropertyProperties = {
  property_id: { type: "string" },
  name: { type: "string" },
  address: { type: "string" },
  type: { type: "string" },
  transactionType: { type: "string" },
  price: { type: "number" },
  paymentFrequency: { type: "string" },
  images: { type: "array", items: { type: "string" } },
  currency: { type: "string" },
};
Object.freeze(publicPropertyProperties);

export const publicProfileProperties = {
  ...userProperties,
  role: { type: "string" },
  businessName: { type: "string" },
  licenseNumber: { type: "string" },
  publicLocation: { type: "object", properties: publicLocationProperties },
  links: { type: "object", properties: publicLinkProperties },
  verified: { type: "boolean" },
  phone: { type: "string" },
  email: { type: "string" },
  activePropertyCount: { type: "number" },
  properties: {
    type: "array",
    items: { type: "object", properties: publicPropertyProperties },
  },
};
Object.freeze(publicProfileProperties);

// Private, account-safe fields returned only for the authenticated user.
export const privateUserProperties = {
  ...userProperties,
  email: { type: "string" },
  address: { type: "string" },
  verified: { type: "boolean" },
  role: { type: "string" },
  businessName: { type: "string" },
  licenseNumber: { type: "string" },
  publicLocation: { type: "object", properties: publicLocationProperties },
  links: { type: "object", properties: publicLinkProperties },
  phone: { type: "string" },
  showPhone: { type: "boolean" },
  showEmail: { type: "boolean" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" },
  properties: { type: "array", items: { type: "string" } },
};
Object.freeze(privateUserProperties);

export const userDetailProperties = privateUserProperties;
