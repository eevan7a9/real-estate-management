import dotenv from "dotenv";
import Fastify from "fastify";
import FastifyBcrypt from "fastify-bcrypt";
import FastifyJwt from "fastify-jwt";
import FastifyCors from "fastify-cors";
import FastifySwagger from "fastify-swagger";
import FastifyMultipart from "fastify-multipart";
import FastifyStatic from "fastify-static";
import mongoose from "mongoose";
import path from "path";
// Local Files
import { usersRoutes } from "./routes/users.js";
import { authRoutes } from "./routes/auth/index.js";
import { propertiesRoutes } from "./routes/properties/index.js";
import { enquiriesRoutes } from "./routes/enquiries/index.js";

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
// We serve uploaded files
const __dirname = path.resolve(path.dirname(""));
fastify.register(FastifyStatic, {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads",
});
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
  origin: ["http://localhost:8100"],
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
fastify.register(enquiriesRoutes, { prefix: "/enquiries" });

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
