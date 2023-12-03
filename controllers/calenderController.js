const Leave = require("../models/leaveSchema");
const PublicHoliday = require("../models/publicHolidaysSchema");
const TeamAbailability = require("../models/teamAvailablitySchema");
const User = require("../models/userSchema");

exports.calenderData = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please Give An Email" });
    }

    let check = await User.find({ email });

    const approvedLeave = await Leave.find({
      userId: check[0]._id,
      status: "approved",
    });
    const publicHoliday = await PublicHoliday.find({});
    const teamAvailablity = await TeamAbailability.find({
      email,
    });

    res.json({ approvedLeave, publicHoliday, teamAvailablity });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
