const Company = require("../models/company-model");
const { AppError } = require("../utils/app-error");
const {
  getIranStates,
  getIranProvinces,
} = require("../utils/iran-provinces-states-city");

const checkAddCompanyData = async (req, res, next) => {
  const { registrationNumber, state, city } = req.body;

  const isRegistrationNumberIsDup = await Company.exists({ registrationNumber });
  if (isRegistrationNumberIsDup) {
    return next(new AppError(409, "this registration number already exists"));
  }

  const states = await getIranStates();
  if (!states.includes(state)) {
    return next(new AppError(404, "provide one of the iran states"));
  }

  const cities = await getIranProvinces();
  if (!cities.includes(city)) {
    return next(new AppError(404, "provide one of the iran cities"));
  }

  
};

const addCompany = async (req, res, next) => {
  try {
    const newCompany = req.body;

    const company = new Company(newCompany);
    await company.save();
    console.log(newCompany);

    res.status(200).json({ status: "success", data: newCompany });
  } catch (error) {
    next(error);
  }
};

module.exports = { addCompany };
