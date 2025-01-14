const Employee = require("../models/employee-model");
const { AppError } = require("../utils/app-error");
const { getIranProvinces } = require("../utils/iran-provinces-states-city");
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
      return next(new AppError(409, "this national ID already exists"));
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

const checkEditEmployeeData = async (request, response, next) => {
  try {
    const { id } = request.params;
    const { phonenumber, nationalId, province } = request.body;

    // const employees = await Employee.find({});
    // const employeesPhoneNumbers = employees.map((employee, index) => {
    //   return { index, phonenumbers: employee.phonenumber };
    // });

    // const isPhoneNumberDupplicate = employeesPhoneNumbers.filter((employee) => {
    //   for (let phone of employee.phonenumbers) {
    //     if (phonenumber.includes(phone)) {
    //       return true;
    //     }
    //     return false;
    //   }
    // });

    // const checkPhoneNumberIsExist = isPhoneNumberDupplicate.map(
    //   (employee) => employees[employee.index]
    // );

    // console.log(checkPhoneNumberIsExist);

    // console.log(checkPhoneNumberIsExist[0]._id.toString() === id);
    // console.log(
    //   checkPhoneNumberIsExist.length > 0 &&
    //     checkPhoneNumberIsExist[0]._id.toString() !== id
    // );

    // if (
    //   checkPhoneNumberIsExist.length > 0 &&
    //   checkPhoneNumberIsExist[0]._id.toString() !== id
    // ) {
    //   return next(new AppError(409, "one of the phonenumbers already exists"));
    // }

    // const employees = await Employee.find({});

    //// const checkPhoneNumberIsExist = employees.find((employee) =>
    ////   employee.phonenumber.some((phone) => phonenumber.includes(phone))
    // // );
    //// if (checkPhoneNumberIsExist && checkPhoneNumberIsExist._id.toString() !== id) {
    // //   return next(new AppError(409, "one of the phone numbers already exists"));
    //// }

    const employees = await Employee.find({});
    const checkPhoneNumberIsExist = employees
      .filter((employee) => employee._id.toString() !== id)
      .some((employee) =>
        employee.phonenumber.some((phone) => phonenumber.includes(phone))
      );

    if (checkPhoneNumberIsExist) {
      return next(new AppError(409, "one of the phone numbers already exists"));
    }

    const checkNationalIdIsExist = await Employee.exists({ nationalId });

    if (checkNationalIdIsExist && checkNationalIdIsExist._id.toString() !== id) {
      return next(new AppError(409, "this national id already exists"));
    }

    // const checkNationalIdIsExist = employees
    //   .filter((employee) => employee._id.toString() !== id)
    //   .some((employee) => employee.nationalId === nationalId);
    // if (checkNationalIdIsExist) {
    //   return next(new AppError(409, "this national id already exists"));
    // }

    if (province === "not-set") {
      return next();
    }
    const iranProvinces = await getIranProvinces();
    if (!iranProvinces.includes(province)) {
      return next(new AppError(404, "province is not valid  "));
    }

    next();
  } catch (error) {
    next(error);
  }
};

const editEmployee = async (request, response, next) => {
  try {
    const { id } = request.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return next(new AppError(404, "provide valid id"));
    }

    const { firstname, lastname, gender, dateOfBirth, phonenumber, nationalId } =
      request.body;
    let { province = "not-set" } = request.body;

    if (province === "not-set") {
      province === null;
    }

    employee.firstname = firstname ?? employee.firstname;
    employee.lastname = lastname ?? employee.lastname;
    employee.gender = gender ?? employee.gender;
    employee.dateOfBirth = dateOfBirth ?? employee.dateOfBirth;
    employee.phonenumber = phonenumber ?? employee.phonenumber;
    employee.nationalId = nationalId ?? employee.nationalId;
    employee.province = province ?? employee.province;

    await employee.save();

    response.status(200).json({ status: "success", data: { employee } });
  } catch (error) {
    next(error);
  }
};

const deleteEmployeeById = async (request, response, next) => {
  try {
    const { id: employeeId } = request.params;

    const employee = await Employee.findByIdAndDelete(employeeId);
    if (!employee) {
      return next(new AppError(404, "provide valid id"));
    }

    response.status(200).json({ status: "success", data: { employee } });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addEmployee,
  checkData,
  showAllEmployees,
  editEmployee,
  checkEditEmployeeData,
  deleteEmployeeById,
};
