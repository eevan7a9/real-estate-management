import dotenv from "dotenv";
import Fastify from "fastify";
import FastifyBcrypt from "fastify-bcrypt";
import FastifyJwt from "fastify-jwt";
// Local Files
import { usersRoutes } from "./routes/users.js";
import { authRoutes } from "./routes/auth.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

export const fastify = await Fastify({ logger: process.env.LOGGER || true });

fastify.register(FastifyJwt, { secret: process.env.SECRET_KEY || "secret" });
fastify.register(FastifyBcrypt, {
  saltWorkFactor: Number(process.env.SALT) || 12,
});
// added authenticate
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.get("/", (_, res) => {
  res.send(true);
});
fastify.register(usersRoutes, { prefix: "/users" });
fastify.register(authRoutes, { prefix: "/auth" });

const start = async () => {
  try {
    fastify.listen(PORT, () => {
      console.log("Listening on PORT: " + PORT);
    });
  } catch (error) {
    fastify.log.error(error);
  }
};

start();
