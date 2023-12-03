const express = require("express");
const {
  registrationController,
} = require("../../controllers/registrationController");
const { loginController } = require("../../controllers/loginController");
const { checkRoleController } = require("../../controllers/checkRoleController");
const { managerHire } = require("../../controllers/managerController");
const _ = express.Router();

_.post("/registration", registrationController);
_.post("/login", loginController);
_.post("/managerhire", managerHire);
_.post("/checkrole", checkRoleController);

module.exports = _;
