require("dotenv").config();
const jwt = require("jsonwebtoken");
exports.checkRoleController = async (req, res) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      let check = jwt.verify(token, process.env.TOKEN_SECRET);
      return res.status(200).json({ success: `Your Role Is ${check.role}` });
    } else {
      return res.status(400).json({ error: "Un Authorised" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
