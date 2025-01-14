const router = require("express").Router();
const {
  addEmployee,
  checkData,
  showAllEmployees,
  editEmployee,
  checkEditEmployeeData,
  deleteEmployeeById,
} = require("../controller/employee-controller");
const {
  addEmployeeValidation,
  editEmployeeValidator,
} = require("../validation/employee-validator");
const { validator } = require("../validation/validator");

router.post("/", validator(addEmployeeValidation), checkData, addEmployee);
router.patch(
  "/:id",
  validator(editEmployeeValidator),
  checkEditEmployeeData,
  editEmployee
);
router.delete("/:id", deleteEmployeeById);

router.get("/", showAllEmployees);

module.exports = router;
