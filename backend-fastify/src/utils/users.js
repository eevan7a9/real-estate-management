import { fastify } from "../index.js";

export const userIdToken = function (token) {
  const { id } = fastify.jwt.decode(token);
  return id;
};

/**
 * Checks if a new password is valid.
 * @param {string} [password] - The password to check.
 * @returns {boolean} Returns true if the password is valid, false otherwise.
 */
export const isPasswordValid = function (password) {
  return (
    password.length >= 8 &&
    password.match(/\d/) &&
    password.match(/[A-Z]/) &&
    password.match(/[a-z]/) &&
    password.match(/[!@#$%^&*(),.?":{}|<>]/)
  );
};
