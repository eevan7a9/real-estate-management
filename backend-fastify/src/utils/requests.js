/**
 * 
 * @param {import("fastify").FastifyRequest} request 
 * @returns users token
 */
export const authBearerToken = function (request) {
  const authorization = request.headers.authorization;
  return authorization.split(" ")[1];
};
