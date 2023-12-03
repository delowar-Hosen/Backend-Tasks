const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const policySchema = new Schema(
  {
    policyType: {
      type: String,
    },
    sickLeave: {
      type: Number,
      required: true,
    },
    accrualRate: {
      type: String,
    },
    maximumleave: {
      type: String,
    },
    vactionLeave: {
      type: Number,
      required: true,
    },
    etcLeave: {
      type: Number,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Policy = mongoose.model("Policy", policySchema);

module.exports = Policy;
