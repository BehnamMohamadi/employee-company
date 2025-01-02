const Employee = require("../models/employee-model");
const { AppError } = require("../utils/app-error");
const { getIranProvinces } = require("../utils/iran-provinces");
const { ApiFeature } = require("../utils/api-feature");

const checkData = async (request, response, next) => {
  try {
    const { province, phonenumber, nationalId } = request.body;

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
    if (checkNationalIdIsExist) {
      return next(new AppError(400, "This national ID already exists"));
    }

    // Phone number validation
    const formattedPhoneNumbers = phonenumber.map((phone) => {
      if (phone.startsWith("0")) {
        return `+98${phone.slice(1)}`;
      }
      return phone;
    });

    for (let phone of formattedPhoneNumbers) {
      const checkPhonenumberIsExist = await Employee.exists({ phonenumber: phone });
      if (checkPhonenumberIsExist) {
        return next(new AppError(409, "Phone number already exists"));
      }
    }

    request.body.phonenumber = formattedPhoneNumbers;
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

const showAllEmployees = async (request, response, next) => {
  try {
    const employeeModel = new ApiFeature(Employee.find({}), request.query);
    employeeModel.limitFields().sort().paginate().filter();
    const employees = await employeeModel.model;

    const totalEmployees = employees.length;

    response.status(200).json({ status: "success", data: { totalEmployees, employees } });
  } catch (error) {
    console.error("Error in showAllEmployees:", error);
    next(error);
  }
};

module.exports = { addEmployee, checkData, showAllEmployees };
