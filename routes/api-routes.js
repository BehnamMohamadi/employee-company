const router = require("express").Router();
const employeeRouter = require("./employee-routes");

router.use("/employee", employeeRouter);

module.exports = router;
