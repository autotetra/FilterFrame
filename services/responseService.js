// utils/responseHandler.js

const sendSuccess = (res, message, data = null, code = 200) => {
  return res.status(code).json({
    status: "success",
    message,
    ...(data !== null && { data }),
  });
};

const sendError = (res, message, code = 500, error = null) => {
  return res.status(code).json({
    status: "error",
    message,
    ...(error && { error }),
  });
};

module.exports = { sendSuccess, sendError };
