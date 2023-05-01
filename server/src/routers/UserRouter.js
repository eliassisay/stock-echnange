import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidator } from "../validators/UserValidator";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { Utils } from "../utils/Utils";
import * as Express from "express";

export const userRouter = Express.Router();
userRouter.post(
  "/register",
  UserValidator.register(),
  GlobalMiddleWare.checkError,
  UserController.register
);

userRouter.post(
  "/login",
  UserValidator.login(),
  GlobalMiddleWare.checkError,
  UserController.login
);

userRouter.post(
  "/resend/verification/email",
  UserValidator.resendVerificationEmail(),
  GlobalMiddleWare.checkError,
  UserController.resendVerificationEmail
);

userRouter.get(
  "/verify/resetPasswordToken",
  UserValidator.verifyResetPasswordToken(),
  GlobalMiddleWare.checkError,
  UserController.verifyResetPasswordToken
);
userRouter.get(
  "/reset/password",
  UserValidator.sendResetPasswordEmail(),
  GlobalMiddleWare.checkError,
  UserController.sendResetPasswordEmail
);

userRouter.patch(
  "/resetPassword",
  UserValidator.resetPassword(),
  GlobalMiddleWare.checkError,
  UserController.resetPassword
);
userRouter.patch(
  "/update/password",
  GlobalMiddleWare.authenticate,
  UserValidator.updatePassword(),
  GlobalMiddleWare.checkError,
  UserController.updatePassword
);

userRouter.patch(
  "/verify",
  UserValidator.verify(),
  GlobalMiddleWare.checkError,
  UserController.verify
);
