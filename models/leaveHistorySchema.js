const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveHistorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LeaveHistory = mongoose.model("LeaveHistory", leaveHistorySchema);

module.exports = LeaveHistory;
