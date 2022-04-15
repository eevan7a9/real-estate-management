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
  fastify.patch("/:id", updatePropertyOpts(fastify, updateProperty));
  fastify.delete("/:id", deletePropertyOpts(fastify, deleteProperty));
  fastify.post("/upload/images/:id", uploadImagesOpts(fastify, addImagesProperty));
  fastify.delete("/upload/images/:id", deleteImagesOpts(fastify, deleteImagesProperty));
  done();
};
