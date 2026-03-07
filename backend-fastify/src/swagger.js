import FastifySwagger from "@fastify/swagger";
import FastifySwaggerUi from "@fastify/swagger-ui";

export const setFastifySwagger = async function (fastify) {
  await fastify.register(FastifySwagger, {
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

  await fastify.register(FastifySwaggerUi, {
    routePrefix: "/docs",
  });
};
