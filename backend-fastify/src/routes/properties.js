import {
  getProperties,
  getProperty,
  createProperty,
  deleteProperty,
} from "../controllers/properties.js";
import {
  getPropertiesOpts,
  getPropertyOpts,
  createPropertyOpts,
  deletePropertyOpts,
} from "./options/properties.js";

export const propertiesRoutes = function (fastify, opts, done) {
  fastify.get("/", getPropertiesOpts(getProperties));
  fastify.get("/:id", getPropertyOpts(getProperty));
  fastify.post("/", createPropertyOpts(createProperty));
  fastify.delete("/:id", deletePropertyOpts(deleteProperty));
  done();
};
