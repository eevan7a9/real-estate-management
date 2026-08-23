import { propertyProperties } from "./schema.js";
import {
  responseSuccess,
  responseError,
} from "../../../utils/schema/response.js";

export const getPropertiesOpts = (handler) => ({
  schema: {
    querystring: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search properties by name or address",
        },
        filter: {
          type: "string",
          description:
            "Filter the properties (e.g., 'industrial', 'residential')",
        },
        sort: {
          type: "string",
          enum: ["latest", "price", "name"],
          description: "Sort properties by 'latest', 'price', or 'name'",
        },
        limit: {
          type: "integer",
          default: 8,
          description: "Limit the number of properties returned",
        },
        lastCreatedAt: {
          type: "string",
          format: "date-time",
          description:
            "Fetch properties created before this date (for pagination)",
        },
        lastPrice: {
          type: "number",
          description:
            "Price of the last property received (for pagination purposes)",
        },
        lastName: {
          type: "string",
          description:
            "Name of the last property received (for pagination purposes)",
        },
        last_id: {
          type: "string",
          description:
            "ID of the last property received (for pagination purposes)",
        },
      },
    },
    response: {
      200: responseSuccess({
        data: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: propertyProperties,
            },
            lastCreatedAt: { type: "string" },
            lastPrice: { type: "string" },
            lastName: { type: "string" },
            last_id: { type: "string" },
            hasMore: { type: "boolean" },
          },
        },
      }),
      400: responseError(),
    },
  },
  handler: handler,
});

export const getMyPropertiesOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "array",
          items: propertyProperties,
        },
      }),
      400: responseError(),
    },
  },
  handler: handler,
});

export const getPropertiesMapOpts = (handler) => ({
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              property_id: { type: "string" },
              name: { type: "string" },
              type: { type: "string" },
              position: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["Point"],
                    default: "Point",
                  },
                  coordinates: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2,
                    description: "[longitude, latitude]",
                  },
                },
                required: ["type", "coordinates"],
              },
            },
          },
        },
      }),
      400: responseError(),
    },
  },
  handler: handler,
});
