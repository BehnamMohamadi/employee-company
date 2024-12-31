const Employee = require("../models/employee-model");
const { AppError } = require("../utils/app-error");
const { getIranProvinces } = require("../utils/iran-provinces");

const checkData = async (request, response, next) => {
  try {
    // Extract variables
    const { province, phoneNumber, nationalId } = request.body;

    // Province validation
    if (province === "not-set") {
      return next();
    }
    const iranProvinces = await getIranProvinces();
    if (!iranProvinces.includes(province)) {
      return next(new AppError(400, "Province is not valid"));
    }

    // National ID validation
    const checkNationalIdIsExist = await Employee.exists({ nationalId });
    if (!!checkNationalIdIsExist) {
      return next(new AppError(400, "This national ID already exists"));
    }

    // Phone number validation
    for (let phone of phoneNumber) {
      if (phone.startsWith("0")) {
        phone = `+98${phone.slice(1)}`;
      }

      const checkPhoneNumberIsExist = await Employee.exists({ phoneNumber: phone });
      if (!!checkPhoneNumberIsExist) {
        return next(new AppError(409, "Phone number already exists"));
      }
    }

    next();
  } catch (error) {
    console.error("Error in checkData:", error);
    next(error);
  }
};

const addEmployee = async (request, response, next) => {
  try {
    const newUser = request.body;

    const employee = new Employee(newUser);
    await employee.save();

    response.status(201).json({ status: "success", data: { newUser } });
  } catch (error) {
    console.error("Error in addEmployee:", error);
    next(error);
  }
};



module.exports = { addEmployee, checkData,  };
