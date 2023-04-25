import User from "../models/User";
import { Utils } from "../utils/Utils";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";
import * as address from "address";
import { Request, Response, NextFunction } from "express";
import { requestStatus, teamStatus } from "../common/static";
import { NodeMailer } from "../utils/NodeMailer";
import * as moment from "moment";

export class UserController {
  static async register(req, res, next) {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const verificationToken = new Utils().genreateVerificationToken(6);
    const ipAddress = address.ip();
    try {
      const hash = await Utils.encryptPassword(password);
      const data = {
        email: email,
        password: hash,
        firstName: firstName,
        lastName: lastName,
        emailVerificationToken: verificationToken,
        emailVerificationTokenTime: Date.now() + new Utils().MAX_TOKEN_TIME,
        ipAddress: ipAddress,
      };

      const user = await User.create(data);

      const token = jwt.sign(
        {
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        process.env.SECRET_KEY,
        { expiresIn: "365d" }
      );

      await NodeMailer.sendEmail({
        to: email,
        subject: "Email Verification",
        html: `Hello ,Please use this OTP to verify your account - <b>${verificationToken}</b>`,
      });

      res.status(200).json({
        message: "REGISTRATION SUCCESSFULL",
        Status_code: 200,
        data: { ...user, token },
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async login(req, res, next) {
    const password = req.body.password;
    const user = (req).user;
    const ipAddress = address.ip();
    try {
      await Utils.comparePassword({
        plainPassword: password,
        encryptedPassword: user.password,
      });
      const token = jwt.sign(
        {
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        process.env.SECRET_KEY,
        { expiresIn: "365d" }
      );

      const lastLogin = await User.findOneAndUpdate(
        { _id: user._id },
        { lastLogin: Date.now(), ipAddress: ipAddress },
        { new: true }
      );
      const data = { user: lastLogin, token: token };
      res
        .status(200)
        .json({ message: "LOGIN SUCCESSFULL", Status_code: 200, data: data });
    } catch (e) {
      next(e);
    }
  }

  static async resendVerificationEmail(
    req,
    res,
    next
  ) {
    const email = req.body.email;
    const verificationToken = new Utils().genreateVerificationToken(6);
    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          emailVerificationToken: verificationToken,
          emailVerificationTokenTime: Date.now() + new Utils().MAX_TOKEN_TIME,
        },
        { new: true }
      );
      console.log(verificationToken);

      if (user) {
        await NodeMailer.sendEmail({
          to: [user.email],
          subject: "Email Verification",
          html: `Hello ,Please use this OTP to verify your account - <b>${verificationToken}</b>`,
        });
        res.status(200).json({
          Status_code: 200,
          success: true,
          message: "Verification token Send",
          data: email,
        });
      } else {
        throw Error("User Does Not Exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async sendResetPasswordEmail(req, res, next) {
    const email = req.query.email;
    const resetPasswordToken = new Utils().genreateVerificationToken(6);

    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          updatedAt: new Date(),
          resetPasswordToken: resetPasswordToken,
          resetPasswordTokenTime: Date.now() + new Utils().MAX_TOKEN_TIME,
        },
        { new: true }
      );

      if (user) {
        res.status(200).send({
          Status_code: 200,
          message: "token has been sent successfully",
        });

        await NodeMailer.sendEmail({
          to: [email],
          subject: "Reset Password email",
          html: `<h1>${resetPasswordToken}</h1>`,
        });
      }

      throw new Error("User Does Not Exist");
    } catch (e) {
      next(e);
    }
  }

  static verifyResetPasswordToken(req, res, next) {
    res.status(200).json({
      Status_code: 200,
      success: true,
      message: "Reset Password token has been Verified",
    });
  }

  static async resetPassword(req, res, next) {
    const user = (req).user;
    const newPassword = req.body.newPassword;
    try {
      const encryptedPassword = await Utils.encryptPassword(newPassword);
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          updated_at: new Date(),
          password: encryptedPassword,
          resetPasswordToken: null,
          resetPasswordTokenTime: null,
        },
        { new: true }
      );

      res.status(200).json({
        Status_code: 200,
        message: "Password RESET SUCCESSFULLY",
        data: updateUser,
      });
    } catch (e) {
      next(e);
    }
  }
  static async updatePassword(req, res, next) {
    const user_id = (req).user._id;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    try {
      const user= await User.findOne({ _id: user_id });
      await Utils.comparePassword({
        plainPassword: password,
        encryptedPassword: user.password,
      });
      const encryptedPassword = await Utils.encryptPassword(newPassword);

      const doc = await User.findOneAndUpdate(
        { _id: user_id },
        { password: encryptedPassword },
        { new: true }
      );
      if (doc) {
        res.status(200).json({
          Status_code: 200,
          message: "Password updated successfully",
          data: doc,
        });
      }
    } catch (e) {
      next(e);
    }
  }
 

}
