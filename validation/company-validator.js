const Joi = require("joi");

const addCompanyValidation = Joi.object({
  name: Joi.string().min(3).max(40).trim().required(),
  state: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  registrationDate: Joi.date().iso().required(),
  registrationNumber: Joi.string()
    .length(6)
    .trim()
    .pattern(/^[0-9]+$/)
    .required(),
  telphone: Joi.string()
    .length(11)
    .trim()
    .pattern(/^[0-9]+$/)
    .required(),
});

module.exports = { addCompanyValidation };
