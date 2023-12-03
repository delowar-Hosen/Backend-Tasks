const bcrypt = require("bcrypt");
const {
  emailValidation,
  passwordValidation,
} = require("../helpers/validation");
const User = require("../models/userSchema");

exports.registrationController = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    //noraml error handleing
    if (!fullName) {
      res.status(400).json({ error: "Please Give A Full Name" });
    }
    if (!email) {
      res.status(400).json({ error: "Please Give A Email" });
    }
    if (!password) {
      res.status(400).json({ error: "Please Give A Password" });
    }

    //email validation
    if (!emailValidation(email)) {
      res.status(400).json({ error: "Please Give A Valid Email Address" });
    }

    //password validation
    if (!passwordValidation(password)) {
      res.status(400).json({ error: "Give At Leat 8 Charather" });
    }
    //user check

    let check = await User.find({ email });

    if (check.length > 0) {
      res.status(400).json({ error: "This Email Already In Use" });
    } else {
      //data store in DB
      bcrypt.hash(password, 10, function (err, hash) {
        const user = new User({
          fullName,
          email,
          password: hash,
          role: "employee",
        });
        user.save();
      });
      return res.status(200).json({ success: "Registration Is Successfull" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
