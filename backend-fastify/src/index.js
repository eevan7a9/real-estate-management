import dotenv from "dotenv";
import Fastify from "fastify";
// import FastifyBcrypt from "fastify-bcrypt";
import FastifyJwt from "@fastify/jwt";
import FastifyCookie from "@fastify/cookie";
import FastifyMultipart from "@fastify/multipart";
import mongoose from "mongoose";
import FastifyWebsocket from "@fastify/websocket";

// Local Files
import { setFastifySwagger } from "./swagger.js";
import { setFastifyCors } from "./cors.js";
import { setFastifyRoutes } from "./routes/index.js";
import { setFastifyStatic } from "./static.js";
import { setFastifyWebsocket } from "./websocket/index.js";
import passwordPlugin from "./plugins/password.js";

dotenv.config();

const jwtSecret = process.env.SECRET_KEY;
if (!jwtSecret || jwtSecret === "secret" || jwtSecret.length < 32) {
  throw new Error(
    "SECRET_KEY must be a unique, non-default value of at least 32 characters.",
  );
}

/**
 * The Fastify instance.
 * @type {import('fastify').FastifyInstance}
 */
export const fastify = await Fastify({
  logger: process.env.LOGGER || true,
  bodyLimit: 2 * 1024 * 1024, // 2MB
});

// We register Argon2 plugin
await fastify.register(passwordPlugin);

// We allow Multi Part Form
await fastify.register(FastifyMultipart, {
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB per file
    files: 10,
  },
});

// We add Secret Key. Access tokens deliberately expire; clients continue to
// receive the same response shape and can re-authenticate when needed.
await fastify.register(FastifyJwt, {
  secret: jwtSecret,
  sign: {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  },
});
await fastify.register(FastifyCookie);
// We register Websocket
await fastify.register(FastifyWebsocket, {
  options: {
    clientTracking: true,
  },
});

// We register authenticate
await fastify.decorate("authenticate", async function (request, reply) {
  try {
    const user = await request.jwtVerify();
    request.user = user;
  } catch (err) {
    reply.send(err);
  }
});

await fastify.decorate("optionalAuthenticate", async function (request) {
  const authorization = request.headers.authorization;
  if (typeof authorization !== "string" || !/^Bearer\s+/i.test(authorization))
    return;

  try {
    request.user = await request.jwtVerify();
  } catch (error) {
    request.log.debug({ err: error }, "Ignoring invalid optional JWT");
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
      fastify.listen(
        {
          port: PORT,
          host: "0.0.0.0",
        },
        () => {
          console.log("Listening on PORT: " + PORT);
        },
      );
    } catch (error) {
      fastify.log.error(error);
      console.log("ERROR", error);
    }
  })
  .catch((e) => {
    fastify.log.error(e);
    process.exit(1); // Exit process on connection error
  });
