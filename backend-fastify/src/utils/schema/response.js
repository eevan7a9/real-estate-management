export const responseSuccess = (
  def = {
    status: 200,
    message: "Success!",
    data: {}
  }
) => ({
  type: "object",
  properties: {
    status: {
      type: "number",
      default: def.status,
    },
    statusCode: {
      type: "number",
      default: def.status,
    },
    message: {
      type: "string",
      default: def.message,
    },
    data: def.data,
  },
});

export const responseError = (
  def = {
    status: 400,
    error: "error",
    message: "Error: Something went wrong, please try again later.",
  }
) => ({
  type: "object",
  properties: {
    status: {
      type: "number",
      default: def.status,
    },
    statusCode: {
      type: "number",
      default: def.status,
    },
    error: {
      type: "string",
      default: def.error,
    },
    message: {
      type: "string",
      default: def.message,
    },

  },
});
