const sendError = (res, statusCode, error, message) => {
  res.status(statusCode).json({
    success: false,
    error,
    message,
  });
};

const sendSuccess = (res, payload, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    ...payload,
  });
};

module.exports = {
  sendError,
  sendSuccess,
};
