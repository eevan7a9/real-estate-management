import { getEnquiries, getEnquiry } from "../controllers/enquiries.js";
import { getEnquiriesOpts, getEnquiryOpts } from "./options/enquiries.js";

export const enquiriesRoutes = function (fastify, opts, done) {
  fastify.get("/", getEnquiriesOpts(getEnquiries));
  fastify.get("/:id", getEnquiryOpts(getEnquiry));
  done();
};
