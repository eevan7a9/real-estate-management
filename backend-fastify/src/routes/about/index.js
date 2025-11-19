import { submitContactForm } from "../../controllers/about/index.js";
import { submitContactFormOpts } from "./options/index.js";

export const aboutRoutes = function(fastify, opts, done)
{
    fastify.post("/submitContactForm",submitContactFormOpts(submitContactForm));
    done();
};