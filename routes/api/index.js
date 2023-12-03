const express = require("express");
const authRoute = require("./auth");
const leaveRoute = require("./leave");
const policyRoute = require("./policy");
const _ = express.Router();

_.use("/auth", authRoute);
_.use("/leave", leaveRoute);
_.use("/policy", policyRoute);

module.exports = _;
