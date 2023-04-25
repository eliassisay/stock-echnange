import { body, query, param } from "express-validator";
import User from "../models/User";

export class UserValidator {
  static register() {
    return [
      body("email", "email is required")
        .isEmail()
        .custom((email) => {
          return User.findOne({ email: email }).then((user) => {
            if (user) {
              throw new Error("User already exists");
            } else {
              return true;
            }
          });
        }),
      body("password", "password is required")
        .isAlphanumeric()
        .isLength({ min: 8, max: 20 })
        .withMessage("password can be between 8 to 20 charaters only")
        .custom((password, { req }) => {
          if (password === req.body.confirmPassword) {
            return true;
          } else {
            throw new Error("Confirm Password and password Should be Matched");
          }
        }),
      body("confirmPassword", "confirm Password is required")
        .isAlphanumeric()
        .withMessage("Password should be alphanumeric")
        .isLength({ min: 8, max: 20 }),
      body("firstName", "first name is required").isString(),
      body("lastName", "last name is required").isString(),
    ];
  }

  static login() {
    return [
      body("email", "Email is required!")
        .isEmail()
        .withMessage("Email should be valid!")
        .custom((email, { req }) => {
          return User.findOne({ email: email, isverified: true }).then(
            (user) => {
              if (user) {
                req.user = user;
                return true;
              } else throw Error("Invalid email or password");
            }
          );
        }),
      body("password", "password is Required").isAlphanumeric(),
    ];
  }

  static resendVerificationEmail() {
    return [body("email", "email is Required").isEmail()];
  }

  static verify() {
    return [
      body("email", "email is Required").isEmail(),
      body("verificationToken", "token is required").isNumeric(),
    ];
  }

  static sendResetPasswordEmail() {
    return [
      query("email", "Email is Required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email: email }).then((user) => {
            if (user) {
              return true;
            } else {
              throw new Error("Email does not exist");
            }
          });
        }),
    ];
  }

  static verifyResetPasswordToken() {
    return [
      query("resetPasswordToken", "Reset Password Token Is Required")
        .isNumeric()
        .custom((token, { req }) => {
          return User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenTime: { $gt: Date.now() },
          }).then((user) => {
            if (user) {
              return true;
            } else {
              throw new Error("Token Does not Exist! Please request Again");
            }
          });
        }),
    ];
  }

  static resetPassword() {
    return [
      body("newPassword", "New Password is required")
        .isAlphanumeric()
        .custom((newPassword, { req }) => {
          if (newPassword === req.body.confirmPassword) {
            return true;
          } else {
            throw new Error(
              "Confirm Password and New Password Should be Matched"
            );
          }
        }),
      body("confirmPassword", "Confirm Password is required").isAlphanumeric(),
      body("resetPasswordToken", "Reset Password Token is Required")
        .isNumeric()
        .custom((token, { req }) => {
          return User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenTime: { $gt: Date.now() },
          }).then((user) => {
            if (user) {
              req.user = user;
              if (Number(req.user.resetPasswordToken) === Number(token)) {
                return true;
              } else {
                req.errorStatus = 422;
                throw new Error("Reset Password Token is Invalid , Try again");
              }
            }
          });
        }),
    ];
  }

  static updatePassword() {
    return [
      body("password", "password is required").isAlphanumeric(),
      body("confirmPassword", "Confirm password is required").isAlphanumeric(),
      body("newPassword", "New password is required")
        .isAlphanumeric()
        .custom((newPassword, { req }) => {
          if (newPassword === req.body.confirmPassword) {
            return true;
          } else {
            req.errorStatus = 422;
            throw new Error("Password and Confirm Password does not Matched");
          }
        }),
    ];
  }
}
