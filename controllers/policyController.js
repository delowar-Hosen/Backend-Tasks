const jwt = require("jsonwebtoken");
const Policy = require("../models/policySchema");
exports.createPolicy = async (req, res) => {
  try {
    const {
      sickLeaveDuration,
      vactionLeaveDuration,
      etcLeaveDuration,
      policyType,
    } = req.body;

    //normal validation
    if (!sickLeaveDuration) {
      res.status(400).json({ error: "Please Give Sick Leave Duration" });
    } else if (!vactionLeaveDuration) {
      res.status(400).json({ error: "Please Give Vaction Leave Duration" });
    } else if (!etcLeaveDuration) {
      res.status(400).json({ error: "Please Etc Vaction Leave Duration" });
    } else {
      let check = await Policy.find({});

      let lowerCase = policyType.toLowerCase();

      if (check.length > 0 && check[0].policyType == lowerCase) {
        res.status(400).json({
          error: `Aleady Have A ${policyType} Policy Created,You Can Only Updated It`,
        });
      } else {
        //token authorisation
        let token = req.headers.authorization;
        if (token) {
          let check = jwt.verify(token, process.env.TOKEN_SECRET);
          if (check.role == "admin") {
            const policy = new Policy({
              sickLeave: sickLeaveDuration,
              vactionLeave: vactionLeaveDuration,
              etcLeave: etcLeaveDuration,
              policyType: lowerCase,
            });
            policy.save();
            res.status(400).json({ success: "Leave Policy Created" });
          } else {
            res.status(400).json({ error: "Un Authorised" });
          }
        } else {
          res.status(400).json({ error: "Un Authorised" });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update policy

exports.updatePolicy = async (req, res) => {
  try {
    const { id, accrualRate, maximumleave } = req.body;

    if (!accrualRate) {
      res.status(400).json({ error: "Please Give A accrualRate" });
    } else if (!maximumleave) {
      res.status(400).json({ error: "Please Give A Maximum Leave" });
    } else if (!id) {
      res.status(400).json({ error: "Please Give A Policy Id For Update" });
    } else {
      //token authorisation
      let token = req.headers.authorization;
      if (token) {
        let check = jwt.verify(token, process.env.TOKEN_SECRET);
        if (check.role == "admin") {
          await Policy.findByIdAndUpdate(
            { _id: id },
            {
              accrualRate,
              maximumleave,
            },
            { new: true }
          );

          res.status(400).json({ success: "Policy Update Successfully " });
        } else {
          res.status(400).json({ error: "Un Authorised" });
        }
      } else {
        res.status(400).json({ error: "Un Authorised" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete policy

exports.deletePolicy = async (req, res) => {
  try {
    const { policyType } = req.body;

    if (!policyType) {
      res
        .status(400)
        .json({ error: "Please Give Policy Type For Delate Policy" });
    } else {
      let check = await Policy.find({ policyType });
      if (check.length > 0) {
        let token = req.headers.authorization;
        if (token) {
          let check = jwt.verify(token, process.env.TOKEN_SECRET);
          if (check.role == "admin") {
            await Policy.findOneAndDelete({ policyType });
            res.status(200).json({ error: "This Policy Has Been Deleted" });
          } else {
            res.status(400).json({ error: "Un Authorised" });
          }
        } else {
          res.status(400).json({ error: "Un Authorised" });
        }
      } else {
        res.status(400).json({ error: "This Policy Type Has Not Created" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
