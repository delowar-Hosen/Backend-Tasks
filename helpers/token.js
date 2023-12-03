require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.jwtToken = (user, expiresIn) => {
  return jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: expiresIn,
  });
};
