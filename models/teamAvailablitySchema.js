const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamAbailabilitySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    email: {
      type: String,
      required:true
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TeamAbailability = mongoose.model(
  "TeamAbailability",
  teamAbailabilitySchema
);

module.exports = TeamAbailability;
