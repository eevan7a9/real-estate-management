import {
  createEnquiry,
  deleteEnquiry,
  getEnquiries,
  getEnquiry,
} from "../controllers/enquiries.js";
import {
  createEnquiryOpts,
  deleteEnquiryOpts,
  getEnquiriesOpts,
  getEnquiryOpts,
} from "./options/enquiries.js";

export const enquiriesRoutes = function (fastify, opts, done) {
  fastify.get("/", getEnquiriesOpts(getEnquiries));
  fastify.get("/:id", getEnquiryOpts(getEnquiry));
  fastify.post("/", createEnquiryOpts(createEnquiry));
  fastify.delete("/:id", deleteEnquiryOpts(deleteEnquiry));
  done();
};
