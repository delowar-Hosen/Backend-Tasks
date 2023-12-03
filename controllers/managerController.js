require("dotenv").config();
const Manager = require("../models/managerSchema");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

exports.managerHire = async (req, res) => {
  try {
    const { email, role } = req.body;

    //normal validation
    if (!email) {
      res.status(400).json({ error: "Please Give A Email" });
    }
    if (!role) {
      res.status(400).json({ error: "Please Give A Role" });
    }

    //authorisation

    let token = req.headers.authorization;
    if (token) {
      let check = jwt.verify(token, process.env.TOKEN_SECRET);
      if (check.role == "admin") {
        //finding email
        const checkEmail = await User.find({ email });
        if (checkEmail.length > 0) {
          await User.findOneAndUpdate({ role });
          const manager = new Manager({
            userId: checkEmail[0]._id,
            name: checkEmail[0].fullName,
            email: checkEmail[0].email,
          });
          manager.save();
          res.status(200).json({ success: "Manager Hired !" });
        } else {
          res.status(400).json({ error: "This Email Is not Found" });
        }
      } else {
        return res.status(200).json({ success: `Your Are Un-Authorised` });
      }
    } else {
      return res.status(400).json({ error: "Un Authorised" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
