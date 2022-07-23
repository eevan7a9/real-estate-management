import {
  createEnquiryOpts,
  deleteEnquiryOpts,
  getEnquiriesOpts,
  getEnquiryOpts,
  updateEnquiryOpts,
} from "./options/index.js";
import {
  createEnquiry,
  deleteEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
} from "../../controllers/enquiries/index.js";

export const enquiriesRoutes = function (fastify, opts, done) {
  fastify.get("/", getEnquiriesOpts(fastify, getEnquiries));
  fastify.get("/:id", getEnquiryOpts(getEnquiry));
  fastify.post("/", createEnquiryOpts(fastify, createEnquiry));
  fastify.patch("/:id", updateEnquiryOpts(fastify, updateEnquiry));
  fastify.delete("/:id", deleteEnquiryOpts(fastify, deleteEnquiry));
  done();
};
