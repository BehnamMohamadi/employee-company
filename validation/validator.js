const { AppError } = require("../utils/app-error");

const validator = (validateSchema) => {
  return (request, response, next) => {
    const { error } = validateSchema.validate(request.body);
    if (!!error) {
      console.error("error in validator", error);
      return next(new AppError(400, error));
    }

    next();
  };
};

module.exports = { validator };
