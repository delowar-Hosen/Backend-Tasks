const express = require("express");
const {
  leaveController,
  checkLeave,
  leaveConfiramation,
  leaveBalance,
  leaveSheudle,
  userLeaveCheck,
  createPublicHoliday,
  createTeamAbailability,
  createLeaveHistory,
  checkUserLeaveHistory,
  generateLeaveReports,
  getPublicHolidaysData,
  checkPublicHoliday,
} = require("../../controllers/leaveController");
const { calenderData } = require("../../controllers/calenderController");

const _ = express.Router();

_.post("/applyleave", leaveController);
_.post("/checkleave", checkLeave);
_.post("/confirmleave", leaveConfiramation);
_.get("/leavebalance", leaveBalance);
_.get("/leaveshedules", leaveSheudle);
_.get("/checkleavebyuser", userLeaveCheck);
_.post("/createholiday", createPublicHoliday);
_.post("/createteamavailability", createTeamAbailability);
_.get("/calenderdata", calenderData);
_.post("/leavehistory", createLeaveHistory);
_.get("/getleavehistory", checkUserLeaveHistory);
_.get("/getleavehistoryreports", generateLeaveReports);
_.get("/getpublicholiday", getPublicHolidaysData);
_.get("/checkpublicholiday", checkPublicHoliday);

module.exports = _;
