const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startDate: {
      type: String,
    },
    leaveType: {
      type: String,
      required: true,
      enum: ["sick", "vaction", "etc"],
    },
    comments: {
      type: String,
    },
    endDate: {
      type: String,
    },
    applyDate: {
      type: String,
    },
    email: {
      type: String,
    },
    fullName: {
      type: String,
    },
    status: {
      type: String,
      default: "waiting",
      enum: ["approved", "cancle", "waiting"],
    },
  },
  {
    timestamps: true,
  }
);

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
