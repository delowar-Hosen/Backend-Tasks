require("dotenv").config();
const mongoose = require("mongoose");

exports.dbConfig = () => {
  mongoose.connect(process.env.DB_URL).then(() => {
    console.log("DB Connected");
  });
};
