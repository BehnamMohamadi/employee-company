function AppError(statusCode, errorMessage) {
  this.statusCode = statusCode;
  this.message = errorMessage;
  this.status = statusCode.toString().startsWith("4") ? "fail" : "error";

  Error.captureStackTrace(this);
}

module.exports = { AppError };
