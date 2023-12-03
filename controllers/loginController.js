const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const { jwtToken } = require("../helpers/token");
const { emailValidation } = require("../helpers/validation");
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //normal error handleing
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

    let check = await User.find({ email });

    if (check.length > 0) {
      bcrypt.compare(password, check[0].password, function (err, result) {
        if (result) {
          const token = jwtToken(
            { id: check[0]._id, role: check[0].role, email: check[0].email },
            "7d"
          );
          res.send({
            token: token,
            success: "Login Is Successfully",
          });
        } else {
          res.status(400).json({ error: "Password Is Worng" });
        }
      });
    } else {
      res
        .status(400)
        .json({ error: "This User Is Not Available, Please Registration" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
