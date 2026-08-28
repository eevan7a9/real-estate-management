import { createContactSubmission } from "../../controllers/contact-submissions/index.js";
import { createContactSubmissionOpts } from "./options/index.js";

export const contactSubmissionsRoutes = function (fastify, opts, done) {
  fastify.post(
    "/",
    createContactSubmissionOpts(fastify, createContactSubmission),
  );
  done();
};
