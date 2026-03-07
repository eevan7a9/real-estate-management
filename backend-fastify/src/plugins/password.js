import argon2 from "argon2";
import fp from "fastify-plugin";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function passwordPlugin(fastify) {
  fastify.decorate(
    "hashPassword",
    /**
     * @param {string} password
     */
    async (password) => {
      return argon2.hash(password);
    },
  );

  fastify.decorate(
    "verifyPassword",
    /**
     * @param {string} password
     * @param {string} hash
     */
    async (password, hash) => {
      return argon2.verify(hash, password);
    },
  );
}

export default fp(passwordPlugin);
