const propertyProperties = {
  type: "object",
  properties: {
    property_id: { type: "string" },
    name: { type: "string" },
    address: { type: "string" },
    description: { type: "string" },
    type: { type: "string" },
    position: {
      type: "object",
      properties: { lat: { type: "number" }, lng: { type: "number" } },
    },
    price: { type: "number" },
    enquiries: { type: "array" },
    features: { type: "array" },
    profileImage: { type: "string" },
    images: { type: "array" },
    currency: { type: "string" },
    contactNumber: { type: "string" },
    contactEmail: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    user_id: { type: "string" },
  },
};
Object.freeze(propertyProperties);

export const getPropertiesOpts = (handler) => ({
  schema: {
    response: {
      200: {
        type: "array",
        items: propertyProperties,
      },
    },
  },
  handler: handler,
});

export const getPropertyOpts = (handler) => ({
  schema: {
    response: {
      200: propertyProperties,
    },
  },
  handler: handler,
});

export const createPropertyOpts = (handler) => ({
  schema: {
    response: {
      201: propertyProperties,
    },
  },
  handler: handler,
});

export const updatePropertyOpts = (handler) => ({
  schema: {
    response: {
      201: {
        type: "object",
        properties: {
          message: { type: "string" },
          property_id: { type: "string" },
        },
      },
    },
  },
  handler: handler,
});

export const deletePropertyOpts = (handler) => ({
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          property_id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
        },
      },
    },
  },
  handler: handler,
});
