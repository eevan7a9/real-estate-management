const success = {
  status: 200,
  message: "Success!",
  data: {}
}
export const responseSuccess = (
  def = success
) => ({
  type: "object",
  properties: {
    status: {
      type: "number",
      default: def.status || success.status,
    },
    statusCode: {
      type: "number",
      default: def.status || success.status,
    },
    message: {
      type: "string",
      default: def.message || success.message,
    },
    data: def.data || success.data,
  },
});

const error = {
  status: 400,
  error: "error",
  message: "Something went wrong, please try again later.",
}
export const responseError = (
  def = error
) => ({
  type: "object",
  properties: {
    status: {
      type: "number",
      default: def.status || error.status,
    },
    statusCode: {
      type: "number",
      default: def.status || error.status,
    },
    error: {
      type: "string",
      default: def.error || error.error,
    },
    message: {
      type: "string",
      default: def.message || error.message,
    },

  },
});
