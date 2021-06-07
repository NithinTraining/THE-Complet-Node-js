const db = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const env = process.env.NODE_ENV || 'local';
const c = require('../config/config.json')[env];
const crypto = require("crypto");
const fs = require("fs");
const ejs = require("ejs");
const { checkPermission } = require("../helpers");
const { Paginate, LimitOffset } = require("../helpers/pagination");

const User = db.user;
const ResetTokens = db.ResetTokens;

module.exports = {
  signUp: async (req, res) => {
    try {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);
      const users = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
      };

      const result = await db.user.create(users);
      let role = {};
      if (req.body.isAdmin) {
        role = await db.role.findOne({ where: { name: "ADMIN" } });
      } else {
        role = await db.role.findOne({ where: { name: "USER" } });
      }
      if (!role) {
        return res.status(400).json({
          success: false,
          message: "no role found",
        });
      }
      console.log(role);
      await db.rolesUser.create({
        user_id: result.user_id,
        role_id: role.role_id,
      });

      return res.status(200).json({
        success: true,
        message: "user created Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },
  login: async (req, res) => {
    try {
      console.log("entered", req.body);
      const user = await db.user.findOne({ where: { email: req.body.email } });
      if (!user) {
        res.status(200).json({
          success: false,
          message: "No User Found",
        });
      } else {
        bcryptjs.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                user_id: user.id,
              },
              "secret"
            );
            res.status(200).json({
              success: true,
              message: "authentication successfull",
              token: token,
            });
          } else {
            res.status(200).json({
              success: false,
              message: "invalid credentials",
            });
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },
  allUsers: async (req, res) => {
    try {
      console.log();
      const { isPermission } = await checkPermission({
        userId: req.user.user_id,
        permission: "LIST_USER",
      });
      if (!isPermission) {
        return res.status(404).json({
          success: false,
          message: "you have no permission to list users",
        });
      }
      // const page = ({ limit = 10, currentPage = 1 } = req.query);
      // const pagination = LimitOffset(Paginate(page));

      // const count = await db.user.count();

      // let usersList = await db.user.findAll({
      //   limit: pagination.limit,
      //   offset: pagination.offset,
      // });

      // usersList = {
      //   userList: usersList ? usersList.map((i) => i.dataValues) : [],
      //   pagination: { ...Paginate(page), totalCount: count },
      // };
      const usersList = await db.user.findAll();
      return res.status(200).json({
        success: true,
        message: "Got All the users",
        data: usersList,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      // console.log(req);
      const { isPermission } = await checkPermission({
        userId: req.user.user_id,
        permission: "VIEW_USER",
      });
      if (!isPermission) {
        return res.status(404).json({
          success: false,
          message: "you have no permission to get profile",
        });
      }

      return res.status(200).json({
        success: true,
        message: "get user profile successfully",
        data: req.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  },
  pforgot: async (req, res, next) => {
    try {
      const email = await User.findOne({ where: { email: req.body.email } });
      if (email == null) {
        return res.json({ status: "email not found" });
      }

      //Create a random reset token
      const fpSalt = crypto.randomBytes(16).toString("hex");
      //token expires after one hour
      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1 / 24);

      //insert token data into DB
      await ResetTokens.create({
        email: req.body.email,
        expiration: expireDate,
        token: fpSalt,
        used: 0,
      });

      //creating the mail
      const html = await ejs.renderFile("template/forgot_mail.ejs", {
        link: `http://localhost:3000/set-password?token=${fpSalt}`, //link of the page where you have a form to enter new password
      });

      //create email
      const message = {
        from: "jazap123@gmail.com",
        to: req.body.email,
        replyTo: "jazap123@gmail.com",
        subject: "FORGOT_PASS_SUBJECT_LINE",
        html: html,
      };

      //send email
      c.transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });

      return res.json({ status: "ok da" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  },

  // gReset: async (req, res, next) => {
  //   /**
  //    * This code clears all expired tokens.
  //    **/
  //   await ResetToken.destroy({
  //     where: {
  //       expiration: { [Op.lt]: Sequelize.fn('CURDATE') },
  //     }
  //   });

  //   //find the token
  //   var record = await ResetToken.findOne({
  //     where: {
  //       email: req.query.email,
  //       expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
  //       token: req.query.token,
  //       used: 0
  //     }

  pReset: async function (req, res, next) {
    try {
      console.log(req.body);

      var record = await ResetTokens.findOne({
        where: {
          token: req.body.token,
          used: 0,
        },
      });
      console.log({ record });
      if (record == null) {
        return res.json({
          status: "error",
          message:
            "Token not found. Please try the reset password process again.",
        });
      }

      // var upd = await ResetToken.update({
      //     used: 1
      //   },
      //   {
      //     where: {
      //       email: req.body.email
      //     }
      // });

      // var newSalt = crypto.randomBytes(64).toString('hex');
      // var newPassword = crypto.pbkdf2Sync(req.body.password, newSalt, 10000, 64, 'sha512').toString('base64');
      const newSalt = await bcryptjs.genSalt(10);
      const newPassword = await bcryptjs.hash(req.body.password, newSalt);

      const user = await User.update(
        {
          password: newPassword,
          salt: newSalt,
        },
        {
          where: {
            email: record.email,
          },
        }
      );
      console.log(user);

      res.json({
        status: "ok",
        message: "Password reset. Please login with your new password.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  },

  setPassword: async (req, res) => {
    res.render("setPasword");
  },
  fileUpload: async (req, res) => {
    try {
      const { isPermission } = await checkPermission({
        userId: req.user.user_id,
        permission: "UPLOAD_FILE",
      });
      if (!isPermission) {
        return res.status(404).json({
          success: false,
          message: "you have no permission to Uploads files",
        });
      }

      const { file } = req.files;
      const uploadFile = await db.file.create({
        image_name: file[0].originalname,
        image: file[0].path,
      });
      await db.fileUser.create({
        user_id: req.user.user_id,
        file_id: uploadFile.file_id,
      });
      return res.status(200).json({
        success: true,
        message: "image upload successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  },
  allFiles: async (req, res) => {
    try {
      const { isPermission } = await checkPermission({
        userId: req.user.user_id,
        permission: "VIEW_FILES",
      });
      if (!isPermission) {
        return res.status(404).json({
          success: false,
          message: "you have no permission to view files",
        });
      }
      const page = ({ limit = 10, currentPage = 1 } = req.query);
      const pagination = LimitOffset(Paginate(page));

      const count = await db.file.count();

      let allFiles = await db.file.findAll({
        limit: pagination.limit,
        offset: pagination.offset,
      });

      allFiles = {
        allFile: allFiles ? allFiles.map((i) => i.dataValues) : [],
        pagination: { ...Paginate(page), totalCount: count },
      };
      // const allFiles=await db.file.findAll();
      return res.status(200).json({
        success: true,
        message: "Got files",
        data: allFiles,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  },
};
