const { leaveTrendsReport, leaveUsageReport } = require("../helpers/reports");
const { dateValidation, isDate } = require("../helpers/validation");
const LeaveHistory = require("../models/leaveHistorySchema");
const Leave = require("../models/leaveSchema");
const Manager = require("../models/managerSchema");
const Policy = require("../models/policySchema");
const PublicHoliday = require("../models/publicHolidaysSchema");
const TeamAbailability = require("../models/teamAvailablitySchema");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//apply for leave
exports.leaveController = async (req, res) => {
  try {
    const { email, startDate, endDate, leaveType, comments } = req.body;
    //noraml error handleing
    if (!email) {
      res.status(400).json({ error: "Please Give A Email" });
    }
    if (!startDate) {
      res.status(400).json({ error: "Please Give A Start Date" });
    }
    if (!endDate) {
      return res.status(400).json({ error: "Please Give A End Date" });
    }
    if (!leaveType) {
      return res.status(400).json({ error: "Please Select A Leave Type" });
    }

    if (isDate(startDate)) {
      return res.status(400).json({ error: "Please Give A Valid Start Date" });
    }
    if (isDate(endDate)) {
      return res.status(400).json({ error: "Please Give A Valid End Date" });
    }

    if (dateValidation(startDate)) {
      return res.status(400).json({ error: "This Start Date Has Been Passed" });
    }
    if (dateValidation(endDate)) {
      return res.status(400).json({ error: "This End Date Has Been Passed" });
    }

    //email check
    let check = await User.find({ email });

    //leave check
    if (check.length > 0) {
      let already = await Leave.find({});
      if (already.length > 0 && already[0].status == "waiting") {
        return res.status(400).json({
          error: "You Already Apply For Leave Please Wait For Confirmation",
        });
      } else {
        if (
          already.length > 0 &&
          (already[0].status == "approved" || already[0].status == "cancel")
        ) {
          await Leave.findByIdAndDelete({ _id: already[0]._id });
        }

        let policy = await Policy.find({ policyType: "leave" });

        //formatted date
        let start = startDate.split("-");
        let end = endDate.split("-");

        let startformat = `20${start[0]}-${start[1]}-${start[2]}`;
        let endformat = `20${end[0]}-${end[1]}-${end[2]}`;

        let startDateForamt = new Date(startformat);
        let endDateForamt = new Date(endformat);

        let diffrence = endDateForamt.getTime() - startDateForamt.getTime();

        let total = Math.ceil(diffrence / (1000 * 60 * 60 * 24));

        if (leaveType == "sick") {
          let sickLeave = policy[0].sickLeave;

          if (total < sickLeave || total == sickLeave) {
            let current = new Date().toLocaleDateString();
            const leave = new Leave({
              userId: check[0]._id,
              startDate,
              endDate,
              email: check[0].email,
              fullName: check[0].fullName,
              applyDate: current,
              leaveType,
              comments,
            });
            leave.save();

            //send notification to manager
            let manager = await Manager.find({});

            await Manager.findOneAndUpdate(
              { email: manager[0].email },
              { $push: { leaveNotification: leave._id } },
              { new: true }
            );

            //send email notification
            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "delowarhosen154@gmail.com", // generated ethereal user
                pass: "tsjbjptgwmlymcmn", // generated ethereal password
              },
            });
            let info = await transporter.sendMail({
              from: "delowarhosen154@gmail.com", // sender address
              to: manager[0].email, // list of receivers
              subject: "Leave Request Submission", // Subject line
              text: `Dear Manager,\n\n${check[0].fullName} has submitted a leave request.\nLeave Type: ${leaveType}\nStart Date: ${startDate}\nEnd Date: ${endDate}\n\nComments: ${comments}\n\nRegards,\nLeave Management System`,
            });

            res.status(200).json({
              success: "Your Request Is Send,Please Wait For Confiramtion",
            });
          } else {
            return res.status(400).json({
              error:
                "Your Applying Leave Is Override Our Leave Policy,Please Contact With Admin",
            });
          }
        } else if (leaveType == "vaction") {
          let vactionLeave = policy[0].vactionLeave;

          if (total < vactionLeave || total == vactionLeave) {
            let current = new Date().toLocaleDateString();
            const leave = new Leave({
              userId: check[0]._id,
              startDate,
              endDate,
              email: check[0].email,
              fullName: check[0].fullName,
              applyDate: current,
              leaveType,
              comments,
            });
            leave.save();

            //send notification to manager
            let manager = await Manager.find({});

            await Manager.findOneAndUpdate(
              { email: manager[0].email },
              { $push: { leaveNotification: leave._id } },
              { new: true }
            );

            //send email notification
            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "delowarhosen154@gmail.com", // generated ethereal user
                pass: "tsjbjptgwmlymcmn", // generated ethereal password
              },
            });
            let info = await transporter.sendMail({
              from: "delowarhosen154@gmail.com", // sender address
              to: manager[0].email, // list of receivers
              subject: "Leave Request Submission", // Subject line
              text: `Dear Manager,\n\n${check[0].fullName} has submitted a leave request.\nLeave Type: ${leaveType}\nStart Date: ${startDate}\nEnd Date: ${endDate}\n\nComments: ${comments}\n\nRegards,\nLeave Management System`,
            });

            return res.status(200).json({
              success: "Your Request Is Send,Please Wait For Confiramtion",
            });
          } else {
            return res.status(400).json({
              error:
                "Your Applying Leave Is Override Our Leave Policy,Please Contact With Admin",
            });
          }
        } else if (leaveType == policy[0].etcLeave) {
          let etcLeave = policy[0].etcLeave;

          if (total < etcLeave || total == etcLeave) {
            let current = new Date().toLocaleDateString();
            const leave = new Leave({
              userId: check[0]._id,
              startDate,
              endDate,
              email: check[0].email,
              fullName: check[0].fullName,
              applyDate: current,
              leaveType,
              comments,
            });
            leave.save();

            //send notification to manager
            let manager = await Manager.find({});

            await Manager.findOneAndUpdate(
              { email: manager[0].email },
              { $push: { leaveNotification: leave._id } },
              { new: true }
            );

            //send email notification
            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "delowarhosen154@gmail.com", // generated ethereal user
                pass: "tsjbjptgwmlymcmn", // generated ethereal password
              },
            });
            let info = await transporter.sendMail({
              from: "delowarhosen154@gmail.com", // sender address
              to: manager[0].email, // list of receivers
              subject: "Leave Request Submission", // Subject line
              text: `Dear Manager,\n\n${check[0].fullName} has submitted a leave request.\nLeave Type: ${leaveType}\nStart Date: ${startDate}\nEnd Date: ${endDate}\n\nComments: ${comments}\n\nRegards,\nLeave Management System`,
            });

            return res.status(200).json({
              success: "Your Request Is Send,Please Wait For Confiramtion",
            });
          } else {
            return res.status(400).json({
              error:
                "Your Applying Leave Is Override Our Leave Policy,Please Contact With Admin",
            });
          }
        }
      }
    } else {
      return res.status(400).json({ error: "This Emai Is Not Found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

//all leaves is checking here by manager
exports.checkLeave = async (req, res) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      let check = jwt.verify(token, process.env.TOKEN_SECRET);
      if (check.role == "manager") {
        let data = await Leave.find({});
        res.send(data);
      } else {
        res.status(400).json({ error: "Un Authorised" });
      }
    } else {
      res.status(400).json({ error: "Un Authorised" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//leave confiramtion

exports.leaveConfiramation = async (req, res) => {
  try {
    const { email, status, comments } = req.body;
    if (!email) {
      res.status(400).json({ error: "Please Give An Leave Applyer Email" });
    }
    if (!status) {
      res.status(400).json({ error: "Please Give A Status" });
    }
    let token = req.headers.authorization;
    if (token) {
      let check = jwt.verify(token, process.env.TOKEN_SECRET);
      if (check.role == "manager") {
        let checkUser = await User.find({ email });
        if (checkUser.length > 0) {
          let user = checkUser[0]._id;
          let checkLeaveUser = await Leave.find({ userId: user });

          if (checkLeaveUser.length > 0) {
            if (status == "approved") {
              const { startDate, endDate } = checkLeaveUser[0];

              //formatted date
              let start = startDate.split("-");
              let end = endDate.split("-");

              let startformat = `20${start[0]}-${start[1]}-${start[2]}`;
              let endformat = `20${end[0]}-${end[1]}-${end[2]}`;

              let startDateForamt = new Date(startformat);
              let endDateForamt = new Date(endformat);

              let diffrence =
                endDateForamt.getTime() - startDateForamt.getTime();

              let total = Math.ceil(diffrence / (1000 * 60 * 60 * 24));
              let totalbalance = await User.find({ email });

              let leaveCheck = totalbalance[0].totalLeaves;
              let part = leaveCheck.split(",");
              let partNumber = part[0];
              let applyDate = checkLeaveUser[0].applyDate;

              if (leaveCheck == "") {
                await User.findOneAndUpdate(
                  { email },
                  {
                    totalLeaves: `${total} ,days`,
                    $push: {
                      leaveBalance: `Apply Date IS ${applyDate} : - ${startDate} To ${endDate} total = ${total} days`,
                    },
                  },
                  { new: true }
                );
              } else {
                let value = Number(partNumber);
                await User.findOneAndUpdate(
                  { email },
                  {
                    totalLeaves: `${value + total},days`,
                    $push: {
                      leaveBalance: `${startDate} To ${endDate} total = ${total} days`,
                    },
                  },
                  { new: true }
                );
              }
              if (comments) {
                await Leave.findByIdAndUpdate(
                  { _id: checkLeaveUser[0]._id },
                  { comments },
                  { new: true }
                );
              }

              await Leave.findByIdAndUpdate(
                { _id: checkLeaveUser[0]._id },
                { status: status },
                { new: true }
              );

              await Manager.updateOne(
                {
                  leaveNotification: checkLeaveUser[0]._id,
                },
                { $pull: { leaveNotification: checkLeaveUser[0]._id } },
                { new: true }
              );

              //send email notification

              let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "delowarhosen154@gmail.com", // generated ethereal user
                  pass: "tsjbjptgwmlymcmn", // generated ethereal password
                },
              });

              let info = await transporter.sendMail({
                from: "delowarhosen154@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Leave Request Submission", // Subject line
                text: `Dear Manager,\n\n${checkLeaveUser[0].fullName} has submitted a leave request.\nLeave Type: ${status}\nStart Date: ${startDate}\nEnd Date: ${endDate}\n\nComments: ${comments}\n\nRegards,\nLeave Management System`,
              });

              res.send({
                success: "Your Request Is Approved",
              });
            } else if (status == "cancel") {
              //send email notification
              let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "delowarhosen154@gmail.com", // generated ethereal user
                  pass: "tsjbjptgwmlymcmn", // generated ethereal password
                },
              });
              let info = await transporter.sendMail({
                from: "delowarhosen154@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Leave Request Submission", // Subject line
                text: `Dear Manager,\n\n${checkLeaveUser[0].fullName} has submitted a leave request.\nLeave Type: ${leaveType}\nStart Date: ${startDate}\nEnd Date: ${endDate}\n\nComments: ${comments}\n\nRegards,\nLeave Management System`,
              });

              return res.status(400).json({ error: "Your Request Is Cancel" });
            } else if (status == "waiting") {
              return res
                .status(400)
                .json({ error: "Your Request Is Waiting For Confirmation" });
            }
          } else {
            return res
              .status(400)
              .json({ error: "This User Not Applying For Leave" });
          }
        } else {
          res.status(400).json({ error: "This Email Is Not Found" });
        }
      } else {
        res.status(400).json({ error: "Un Authorised" });
      }
    } else {
      res.status(400).json({ error: "Un Authorised" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//total approved leave request
exports.leaveBalance = async (req, res) => {
  try {
    let data = await User.find({});
    if (data.length > 0) {
      data.map((item) => {
        if (!item.totalLeaves == "") {
          const { fullName, totalLeaves, leaveBalance } = item;
          res.json([
            {
              fullName,
              totalLeaves,
              leaveBalance,
            },
          ]);
        }
      });
    } else {
      return res.status(400).json({ error: "Nobody Doesnot Apply for Leave" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//leave shedules
exports.leaveSheudle = async (req, res) => {
  try {
    let data = await Leave.find({});
    if (data.length > 0) {
      data.map((item) => {
        if (item.status == "waiting") {
          const { fullName, startDate, endDate, email } = item;
          res.json([
            {
              fullName,
              startDate,
              endDate,
              email,
            },
          ]);
        }
      });
    } else {
      return res.status(400).json({ error: "No Upcoming Leave Shedules" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//check leave by user

exports.userLeaveCheck = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        error:
          "Please Give Your  Email For Track Your Leave And See Your Leave Balance ",
      });
    }
    let token = req.headers.authorization;
    if (token) {
      let check = jwt.verify(token, process.env.TOKEN_SECRET);
      if (check.email == email) {
        let leaveTrack = await Leave.find({ email });
        let leaveBalance = await User.find({ email });
        res.json({
          "Leave Track": leaveTrack,
          "Leave Balance": leaveBalance[0].leaveBalance,
          "Total Leaves": leaveBalance[0].totalLeaves,
        });
      } else {
        res.status(400).json({ error: "Un Authorised" });
      }
    } else {
      res.status(400).json({ error: "Un Authorised" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//create public holidays schema

exports.createPublicHoliday = async (req, res) => {
  try {
    const { name, date } = req.body;

    if (!name) {
      res.status(400).json({ error: "Please Give A Holiday Name" });
    }
    if (!date) {
      res.status(400).json({ error: "Please Give This Holiday Date" });
    }

    let token = req.headers.authorization;
    if (token) {
      let check = jwt.verify(token, process.env.TOKEN_SECRET);
      if (check.role == "manager") {
        const holiday = new PublicHoliday({
          name,
          date,
        });
        holiday.save();

        return res.status(200).json({ error: "Request Is Successfully" });
      } else {
        return res.status(400).json({ error: "Un Authorised" });
      }
    } else {
      res.status(400).json({ error: "Un Authorised" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//create team availability leave
exports.createTeamAbailability = async (req, res) => {
  try {
    const { email, startDate, endDate } = req.body;

    if (!email) {
      res.status(400).json({ error: "Please Give An Email" });
    }
    if (!startDate) {
      res.status(400).json({ error: "Please Give A Start Date" });
    }
    if (!endDate) {
      res.status(400).json({ error: "Please Give A End Date" });
    }

    let token = req.headers.authorization;
    if (token) {
      let check = jwt.verify(token, process.env.TOKEN_SECRET);
      if (check.role == "manager") {
        let check = await User.find({ email });

        if (check.length > 0) {
          const team = new TeamAbailability({
            userId: check[0]._id,
            email: check[0].email,
            startDate,
            endDate,
          });
          team.save();
          return res.status(200).json({ error: "Request Is Successfully" });
        } else {
          return res.status(400).json({ error: "This Email Not Found" });
        }
      } else {
        return res.status(400).json({ error: "Un Authorised" });
      }
    } else {
      res.status(400).json({ error: "Un Authorised" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//create leave history schema

exports.createLeaveHistory = async (req, res) => {
  try {
    const { email, leaveType, startDate, endDate, status, comments } = req.body;
    if (!email) {
      res.status(400).json({ error: "Please Give An Email" });
    }
    if (!leaveType) {
      res.status(400).json({ error: "Please Give Leave Type" });
    }
    if (!startDate) {
      res.status(400).json({ error: "Please Give Leave Start Date" });
    }
    if (!endDate) {
      res.status(400).json({ error: "Please Give Leave End Date" });
    }
    if (!status) {
      res.status(400).json({ error: "Please Give Leave Status" });
    }
    if (!comments) {
      res.status(400).json({ error: "Please Give A Comments" });
    }

    let check = await User.find({ email });

    if (check.length > 0) {
      let token = req.headers.authorization;
      if (token) {
        let check = jwt.verify(token, process.env.TOKEN_SECRET);
        if (check.role == "manager") {
          let leaveCheck = await Leave.find({ email });
          if (leaveCheck.length > 0) {
            const leaveHistory = new LeaveHistory({
              userId: leaveCheck[0]._id,
              email: leaveCheck[0].email,
              leaveType,
              startDate,
              endDate,
              status,
              comments,
            });
            leaveHistory.save();

            return res.status(200).json({ error: "Request Is Successfully" });
          } else {
            return res
              .status(400)
              .json({ success: "This User Had Not Request For Leave" });
          }
        } else {
          return res.status(400).json({ error: "Un Authorised" });
        }
      } else {
        res.status(400).json({ error: "Un Authorised" });
      }
    } else {
      res.status(400).json({ error: "Email Not Found" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//check user leave history

exports.checkUserLeaveHistory = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Please Give An Email" });
    }

    let check = await User.find({ email });

    if (check.length > 0) {
      let leaveCheck = await Leave.find({ email });
      if (leaveCheck.length > 0) {
        let data = await LeaveHistory.find({ email });
        res.send(data);
      } else {
        return res
          .status(400)
          .json({ success: "This User Had Not Request For Leave" });
      }
    } else {
      return res.status(400).json({ error: "Email Not Found" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//generate leave reports

exports.generateLeaveReports = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Please Give An Email" });
    }

    let check = await User.find({ email });

    if (check.length > 0) {
      let leaveCheck = await Leave.find({ email });
      if (leaveCheck.length > 0) {
        let data = await LeaveHistory.find({ email });

        const leaveTrends = leaveTrendsReport(data);
        const leaveUsage = leaveUsageReport(data);

        res.json({ leaveTrends, leaveUsage });
      } else {
        return res
          .status(400)
          .json({ success: "This User Had Not Request For Leave" });
      }
    } else {
      return res.status(400).json({ error: "Email Not Found" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//get public holiday data
exports.getPublicHolidaysData = async (req, res) => {
  try {
    let publicHoliday = await PublicHoliday.find({});
    res.send(publicHoliday);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//check the date is public holiday  it or not
exports.checkPublicHoliday = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      res.status(400).json({ error: "Please Give The Date" });
    }

    let isPublicHoliday = await PublicHoliday.exists({ date });

    if (isPublicHoliday) {
      res.json({ isPublicHoliday });
    } else {
      res.status(400).json({ error: "This Date Is Not PublicHoliday" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
