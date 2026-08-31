/**
 *  Schema for multiple users request
 */
import { privateUserProperties } from "./schema.js";
import {
  responseSuccess,
  responseError,
} from "../../../utils/schema/response.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Function} handler
 * @returns
 */
export const updateUserOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    body: {
      type: "object",
      properties: {
        fullName: { type: "string", minLength: 4 },
        about: { type: "string", maxLength: 1000 },
        address: { type: "string", maxLength: 300 },
        role: { type: "string", enum: ["owner", "agent", "broker"] },
        businessName: { type: "string", maxLength: 150 },
        licenseNumber: { type: "string", maxLength: 100 },
        publicLocation: {
          type: "object",
          properties: {
            city: { type: "string", maxLength: 100 },
            region: { type: "string", maxLength: 100 },
            country: { type: "string", maxLength: 100 },
          },
          additionalProperties: false,
        },
        links: {
          type: "object",
          properties: {
            website: { type: "string", maxLength: 500 },
            facebook: { type: "string", maxLength: 500 },
            instagram: { type: "string", maxLength: 500 },
            linkedin: { type: "string", maxLength: 500 },
            x: { type: "string", maxLength: 500 },
            youtube: { type: "string", maxLength: 500 },
            tiktok: { type: "string", maxLength: 500 },
          },
          additionalProperties: false,
        },
        phone: { type: "string", maxLength: 30 },
        showPhone: { type: "boolean" },
        showEmail: { type: "boolean" },
      },
      additionalProperties: false,
    },
    response: {
      200: responseSuccess({
        data: {
          type: "object",
          properties: privateUserProperties,
        },
      }),
      400: responseError(),
    },
  },
  handler: handler,
});

export const uploadProfileImageOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        message: "Success: profile image uploaded.",
        data: { type: "object", properties: privateUserProperties },
      }),
      400: responseError(),
      401: responseError({ status: 401 }),
      404: responseError({ status: 404 }),
      413: responseError({ status: 413 }),
      500: responseError({ status: 500 }),
    },
  },
  handler,
});
