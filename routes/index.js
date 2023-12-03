require("dotenv").config();
const express = require("express");
const apiRoutes = require("./api");
const _ = express.Router();

const api = process.env.API;

_.use(api, apiRoutes);
_.use(api, (req, res) => {
  res.json({ error: "APi Not Found" });
});

module.exports = _;
