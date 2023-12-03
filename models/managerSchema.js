const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const managerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },

    leaveNotification: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leave" }],
  },
  {
    timestamps: true,
  }
);

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
