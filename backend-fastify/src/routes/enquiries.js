import { getEnquiries } from "../controllers/enquiries.js";
import { getEnquiriesOpts } from "./options/enquiries.js";

export const enquiriesRoutes = function (fastify, opts, done) {
  fastify.get("/", getEnquiriesOpts(getEnquiries));
  done();
};
