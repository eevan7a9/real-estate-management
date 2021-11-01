import dotenv from "dotenv";
import Fastify from "fastify";
import FastifyBcrypt from "fastify-bcrypt";
import FastifyJwt from "fastify-jwt";
import FastifyCors from "fastify-cors";
import FastifySwagger from "fastify-swagger";
import FastifyMultipart from 'fastify-multipart';
import mongoose from "mongoose";
// Local Files
import { usersRoutes } from "./routes/users.js";
import { authRoutes } from "./routes/auth.js";
import { propertiesRoutes } from "./routes/properties.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

export const fastify = await Fastify({ logger: process.env.LOGGER || true });

fastify.register(FastifySwagger, {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: {
      title: "API Documentation",
      description: "Fastify swagger API documentation.",
      version: "0.1.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
  },
});
// We allow Multi Part Form
fastify.register(FastifyMultipart);
// We add Secret Key
fastify.register(FastifyJwt, { secret: process.env.SECRET_KEY || "secret" });
// We add Salt
fastify.register(FastifyBcrypt, {
  saltWorkFactor: Number(process.env.SALT) || 12,
});
// We allowed cors
fastify.register(FastifyCors, {
  // put your options here
  origin: ["http://localhost:9000"],
});
// We register authenticate
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});
// We set the routes
fastify.get("/", (_, res) => {
  res.send(true);
});
fastify.register(usersRoutes, { prefix: "/users" });
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(propertiesRoutes, { prefix: "/properties" });

const start = async () => {
  try {
    fastify.listen(PORT, () => {
      console.log("Listening on PORT: " + PORT);
    });
  } catch (error) {
    fastify.log.error(error);
  }
};
mongoose
  .connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => start())
  .catch((e) => fastify.log.error(e));
