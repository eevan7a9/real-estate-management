import { getProperties, getProperty } from "../controllers/properties.js";

const propertyProperties = {
  id: { type: "string" },
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
  userId: { type: "string" },
};

const getPropertiesOpts = () => ({
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: propertyProperties,
        },
      },
    },
  },
  handler: getProperties,
});

const getPropertyOpts = () => ({
  schema: {
    response: {
      200: {
        type: "object",
        properties: propertyProperties,
      },
    },
  },
  handler: getProperty,
});

export const propertiesRoutes = function (fastify, opts, done) {
  fastify.get("/", getPropertiesOpts());
  fastify.get("/:id", getPropertyOpts());
  done();
};
