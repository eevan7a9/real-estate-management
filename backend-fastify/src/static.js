import FastifyStatic from "fastify-static";
import path from "path";

export const setFastifyStatic = function (fastify) {
  // We serve uploaded files
  const __dirname = path.resolve(path.dirname(""));
  fastify.register(FastifyStatic, {
    root: path.join(__dirname, "uploads"),
    prefix: "/uploads",
  });
};
