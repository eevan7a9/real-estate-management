import {
  getProperties,
  getProperty,
  createProperty,
} from "../controllers/properties.js";
import {
  getPropertiesOpts,
  getPropertyOpts,
  createPropertyOpts,
} from "./response/properties.js";

export const propertiesRoutes = function (fastify, opts, done) {
  fastify.get("/", getPropertiesOpts(getProperties));
  fastify.get("/:id", getPropertyOpts(getProperty));
  fastify.post("/", createPropertyOpts(createProperty));
  done();
};
