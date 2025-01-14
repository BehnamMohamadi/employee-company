const router = require("express").Router();
const { validator } = require("../validation/validator");
const { addCompanyValidation } = require("../validation/company-validator");

const { addCompany } = require("../controller/company-controller");

router.post("/", validator(addCompanyValidation), addCompany);

module.exports = router;
