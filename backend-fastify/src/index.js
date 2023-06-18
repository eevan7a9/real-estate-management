import dotenv from "dotenv";
import Fastify from "fastify";
import FastifyBcrypt from "fastify-bcrypt";
import FastifyJwt from "@fastify/jwt";
import FastifyMultipart from "@fastify/multipart";
import mongoose from "mongoose";
import FastifyWebsocket from '@fastify/websocket';

// Local Files
import { setFastifySwagger } from "./swagger.js";
import { setFastifyCors } from "./cors.js";
import { setFastifyRoutes } from "./routes/index.js";
import { setFastifyStatic } from "./static.js";
import { setFastifyWebsocket } from "./websocket/index.js"

dotenv.config();

/**
 * The Fastify instance.
 * @type {import('fastify').FastifyInstance}
 */
export const fastify = await Fastify({ logger: process.env.LOGGER || true });

// We allow Multi Part Form
fastify.register(FastifyMultipart);
// We add Secret Key
fastify.register(FastifyJwt, { secret: process.env.SECRET_KEY || "secret" });
// We add Salt
fastify.register(FastifyBcrypt, {
  saltWorkFactor: Number(process.env.SALT) || 12,
});
// We register Websocket
fastify.register(FastifyWebsocket);

// We register authenticate
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});
// Generate API documentation
setFastifySwagger(fastify);
// We serve static files -ex uploads/
setFastifyStatic(fastify);
// We allowed cors
setFastifyCors(fastify);
// We register routes
setFastifyRoutes(fastify);
// We set webSocket connection
setFastifyWebsocket();

mongoose
  .connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    try {
      fastify.listen(PORT, () => {
        console.log("Listening on PORT: " + PORT);
      });
    } catch (error) {
      fastify.log.error(error);
    }
  })
  .catch((e) => fastify.log.error(e));
