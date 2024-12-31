const router = require("express").Router();
const { addEmployee, checkData } = require("../controller/employee-controller");
const { addEmployeeValidation } = require("../validation/employee-validator");
const { validator } = require("../validation/validator");

router.post("/add-employee", validator(addEmployeeValidation), checkData, addEmployee);

module.exports = router;
