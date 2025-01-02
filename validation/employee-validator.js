const Joi = require("joi");

const addEmployeeValidation = Joi.object({
  firstname: Joi.string().min(3).max(40).required().trim(),
  lastname: Joi.string().min(3).max(40).required().trim(),
  gender: Joi.string().valid("male", "female", "not-set"),
  dateOfBirth: Joi.date().iso().required(),
  phonenumber: Joi.array()
    .min(1)
    .items(Joi.string().pattern(/^(\+98|0)?9\d{9}$/))
    .required(),
  nationalId: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  province: Joi.string().required(),
});

module.exports = { addEmployeeValidation };
