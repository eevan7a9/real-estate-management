import dotenv from "dotenv";
import Fastify from "fastify";

dotenv.config();
const PORT = process.env.PORT;

export const fastify = await Fastify({ logger: true });

fastify.get("/", (_, res) => {
  res.send(true);
});

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
