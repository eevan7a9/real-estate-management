export const responseError = (
  deff = {
    status: 400,
    error: "error",
    message: "Error: Something went wrong, please try again later.",
  }
) => ({
  type: "object",
  properties: {
    status: {
      type: "number",
      default: deff.status,
    },
    statusCode: {
      type: "number",
      default: deff.status,
    },
    error: {
      type: "string",
      default: deff.error,
    },
    message: {
      type: "string",
      default: deff.message,
    },

  },
});
