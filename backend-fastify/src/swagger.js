import FastifySwagger from "fastify-swagger";

export const setFastifySwagger = function (fastify) {
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
};
