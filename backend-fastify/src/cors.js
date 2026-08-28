import FastifyCors from "@fastify/cors";

export const setFastifyCors = function (fastify) {
  const configuredOrigins = (process.env.FRONTEND_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const localOrigins = [
    "http://localhost:9000",
    "http://localhost:8100",
    "http://localhost:4200",
  ];
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? configuredOrigins
      : [...localOrigins, ...configuredOrigins];

  fastify.register(FastifyCors, {
    origin: allowedOrigins,
    credentials: true,
  });
};
