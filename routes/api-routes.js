const router = require("express").Router();
const employeeRouter = require("./employee-routes");
const companyRouter = require("./company-routes");

router.use("/employee", employeeRouter);
router.use("/company", companyRouter);

module.exports = router;
