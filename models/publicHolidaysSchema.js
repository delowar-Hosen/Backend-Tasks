const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const publicHolidaysSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PublicHoliday = mongoose.model("PublicHoliday", publicHolidaysSchema);

module.exports = PublicHoliday;
