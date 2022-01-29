import FastifyCors from "fastify-cors";

export const setFastifyCors = function (fastify) {
  fastify.register(FastifyCors, {
    // put your options here
    origin: ["http://localhost:9000"],
    origin: ["http://localhost:8100"],
    origin: ["http://localhost:4200"],
  });
};
