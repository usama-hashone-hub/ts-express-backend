import { User, UserModel } from "../user/user.schema";
import tokenTypes from "../../utils/tokens";
import tokenService from "./token/token.service";
import { AuthUser } from "./graphql-apis/auth.types";
import * as bcrypt from "bcrypt";
import { DocumentType } from "@typegoose/typegoose";
import userService from "../user/user.service";
import ApiError from "../../utils/ApiError";
import HttpStatus from "../../utils/HttpStatus";
import {
  ChangePasswordInput,
  ForgetInput,
  ForgetInputCode,
  UpdatePasswordInput,
} from "./graphql-apis/auth.input";
import dayjs from "dayjs";

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const user = (await UserModel.findOne({ email })) as DocumentType<User>;

  const passCheck = await bcrypt.compare(password, user.password);

  if (!user || !passCheck) {
    throw new Error("Incorrect email or password");
  }

  const tokens = await tokenService.generateAuthTokens(user);

  return { ...user.toObject(), ...tokens };
};

export const refreshAuth = async (refreshToken: string): Promise<Object> => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await UserModel.findById(refreshTokenDoc.sub as string);
    if (!user) {
      throw new Error();
    }

    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new Error("Please authenticate");
  }
};

const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(
      resetPasswordTokenDoc.sub as string
    );
    if (!user) {
      throw new Error("User not found with this token");
    }
    await UserModel.findByIdAndUpdate(user._id, {
      password: await bcrypt.hash(newPassword, 8),
    });
  } catch (error) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Password reset failed");
  }
};

const changePassword = async ({
  email,
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<User> => {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "No user found.");
  }

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "Your current password is wrong."
    );
  }

  if (await bcrypt.compare(currentPassword, newPassword)) {
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "New Password cannot be same as old password."
    );
  }

  user.password = newPassword;
  await user.save();

  return user;
};

const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(
      verifyEmailTokenDoc.sub as string
    );
    if (!user) {
      throw new Error();
    }
    await UserModel.findByIdAndUpdate(user._id, {});
  } catch (error) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

const forgetPassword = async (input: ForgetInput) => {
  const code = Math.floor(100000 + Math.random() * 900000);
  const user = await UserModel.findByEmail(input.email);

  if (!user) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Email not found");
  }

  //  await this.mailService.forgetPasswordEmail(user, code);
  await UserModel.findByIdAndUpdate(user._id, {
    passwordResetCode: code,
    passwordResetExpireAt: dayjs().add(10, "minutes").format(),
  });
};

const verifyForgetPassword = async (input: ForgetInputCode) => {
  const user = await UserModel.findByEmail(input.email);

  if (!user) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Email not found");
  }

  if ((user?.passwordResetExpireAt as string) < dayjs().format()) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Code is Expired");
  }
  if ((user?.passwordResetCode as string) != input.code) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Code is wrongs");
  }
  await UserModel.findByIdAndUpdate(user?._id, {
    isEmailVerified: true,
  });

  return await tokenService.generateResetPasswordToken(user?.email as string);
};

const verifyTokenUpdatePassword = async (input: UpdatePasswordInput) => {
  const payload = await tokenService.verifyToken(
    input.token,
    tokenTypes.RESET_PASSWORD
  );

  const user = await userService.getUserById(payload.sub as string);

  if (!user) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Email not found");
  }

  await UserModel.findByIdAndUpdate(user._id, {
    password: await bcrypt.hash(input.password, 8),
  });

  const tokens = await tokenService.generateAuthTokens(user);

  return { ...user, ...tokens };
};

const testFunc = async (payload: any) => {
  console.log("In test fundtion", payload);
};

export default {
  loginUserWithEmailAndPassword,
  resetPassword,
  changePassword,
  forgetPassword,
  verifyForgetPassword,
  verifyTokenUpdatePassword,
  verifyEmail,
  testFunc,
};
