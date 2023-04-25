import * as mongoose from "mongoose";
import { model } from "mongoose";
import { Image } from "../common/static";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: {
    type: String,
    required: true,
    default: Image.profile,
  },
  role: {
    type: String,
    default: "",
    enum: ["", "GUEST", "EMPLOYEE", "ADMIN", "CLIENT", "SUPERADMIN", "MANAGER"],
  },
  personalTeamId: { type: mongoose.Types.ObjectId, default: null, ref: "team" },
  isAdminAccess: { type: Boolean, default: false },
  status: { type: String, default: "", enum: ["", "ACTIVE", "DISABLED"] },
  isMember: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, required: true, default: false },
  emailVerificationToken: { type: Number, required: true },
  emailVerificationTokenTime: { type: Date, required: true },
  resetPasswordToken: { type: Number, required: false },
  resetPasswordTokenTime: { type: Date, required: false },
  workSpaces: [
    { type: mongoose.Types.ObjectId, ref: "workspace", default: null },
  ],
  ipAddress: { type: String, required: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

export default model("user", userSchema);
