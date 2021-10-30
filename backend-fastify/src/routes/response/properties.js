const propertyProperties = {
  type: "object",
  properties: {
    property_id: { type: "string" },
    user_id: { type: "string" },
    address: { type: "string" },
    description: { type: "string" },
    name: { type: "string" },
    type: { type: "string" },
    position: {
      type: "object",
      properties: { lat: { type: "number" }, lng: { type: "number" } },
    },
    price: { type: "number" },
    date: { type: "string" },
    enquiries: { type: "array" },
    currency: { type: "string" },
    features: { type: "array" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
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
