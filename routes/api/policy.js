const express = require("express");
const {
  createPolicy,
  updatePolicy,
  deletePolicy,
} = require("../../controllers/policyController");
const _ = express.Router();

_.post("/policycreate", createPolicy);
_.post("/policyupdate", updatePolicy);
_.post("/policydelete", deletePolicy);

module.exports = _;
