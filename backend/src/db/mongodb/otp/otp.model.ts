import { model } from "mongoose";
import otpSchema from "./otp.schema.js";
import { IPendingUser } from "./otp.schema.js";

const otpModel = model<IPendingUser>("otp", otpSchema);

export default otpModel;