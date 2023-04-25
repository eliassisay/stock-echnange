import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidator } from "../validators/UserValidator";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { RoleController } from "../controllers/RoleController";
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

userRouter.get(
  "/getProfile",
  GlobalMiddleWare.authenticate,
  GlobalMiddleWare.checkError,
  UserController.getProfile,
  UserValidator.getProfile()
);

userRouter.get(
  "/getUsers",
  GlobalMiddleWare.authenticate,
  GlobalMiddleWare.checkError,
  UserController.getUsers,
  UserValidator.getUsers()
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////
userRouter.post(
  "/createRole",
  GlobalMiddleWare.authenticate,
  GlobalMiddleWare.checkError,
  RoleController.createRole,
  UserValidator.createRole()
);

userRouter.patch(
  "/editRole/:roleId",
  GlobalMiddleWare.authenticate,
  GlobalMiddleWare.checkError,
  RoleController.editRoleByAdmin,
  UserValidator.editRoleByAdmin()
);
userRouter.delete(
  "/deleteRole/:roleId",
  GlobalMiddleWare.authenticate,
  GlobalMiddleWare.checkError,
  RoleController.deleteRoleByAdmin
  // UserValidator.deleteRole()
);
userRouter.get(
  "/getRoles",
  GlobalMiddleWare.authenticate,
  GlobalMiddleWare.checkError,
  RoleController.getRoles
  // UserValidator.getRoles()
);

userRouter.get(
  "/getRoleDetails/:roleId",
  GlobalMiddleWare.authenticate,
  GlobalMiddleWare.checkError,
  RoleController.getRoleById
  // UserValidator.getRoleById
);
userRouter.patch(
  "/addTeamRole/:_id/:memberId",
  GlobalMiddleWare.authenticate,
  UserValidator.addRole(),
  GlobalMiddleWare.checkError,
  RoleController.addRole
);

userRouter.patch(
  "/editTeamRole/:_id/:memberId",
  GlobalMiddleWare.authenticate,
  GlobalMiddleWare.checkError,
  RoleController.editRole
);
