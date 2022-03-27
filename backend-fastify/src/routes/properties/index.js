import {
  getPropertiesOpts,
  getPropertyOpts,
  createPropertyOpts,
  updatePropertyOpts,
  deletePropertyOpts,
  uploadImagesOpts,
  deleteImagesOpts,
} from "./options/index.js";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  addImagesProperty,
  deleteImagesProperty,
} from "../../controllers/properties/index.js";

export const propertiesRoutes = function (fastify, opts, done) {
  fastify.get("/", getPropertiesOpts(getProperties));
  fastify.get("/:id", getPropertyOpts(getProperty));
  fastify.post("/", createPropertyOpts(fastify, createProperty));
  fastify.patch("/:id", updatePropertyOpts(updateProperty));
  fastify.delete("/:id", deletePropertyOpts(deleteProperty));
  fastify.post("/upload/images/:id", uploadImagesOpts(addImagesProperty));
  fastify.delete("/upload/images/:id", deleteImagesOpts(deleteImagesProperty));
  done();
};
