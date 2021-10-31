import {
  getProperties,
  getProperty,
  createProperty,
  deleteProperty,
  updateProperty,
} from "../controllers/properties.js";
import {
  getPropertiesOpts,
  getPropertyOpts,
  createPropertyOpts,
  updatePropertyOpts,
  deletePropertyOpts,
} from "./options/properties.js";

export const propertiesRoutes = function (fastify, opts, done) {
  fastify.get("/", getPropertiesOpts(getProperties));
  fastify.get("/:id", getPropertyOpts(getProperty));
  fastify.post("/", createPropertyOpts(createProperty));
  fastify.patch("/:id", updatePropertyOpts(updateProperty));
  fastify.delete("/:id", deletePropertyOpts(deleteProperty));
  done();
};
