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
  fastify.get("/", getEnquiriesOpts(getEnquiries));
  fastify.get("/:id", getEnquiryOpts(getEnquiry));
  fastify.post("/", createEnquiryOpts(fastify, createEnquiry));
  fastify.patch("/:id", updateEnquiryOpts(updateEnquiry));
  fastify.delete("/:id", deleteEnquiryOpts(deleteEnquiry));
  done();
};
