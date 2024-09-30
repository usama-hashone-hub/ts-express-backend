import dayjs, { Dayjs } from "dayjs";
import { User, UserModel } from "../../user/user.schema";
import jwt, { JwtPayload } from "jsonwebtoken";
import tokenTypes from "./token.enum";

const getPayload = async (token: string): Promise<{ user?: User | null }> => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    return { user: await UserModel.findById(payload.sub) };
  } catch (err) {
    return {};
  }
};

const generateToken = async (
  userId: string,
  expires: Dayjs,
  type: string,
  secret = process.env.JWT_SECRET
): Promise<string> => {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret as string);
};

const verifyToken = async (
  token: string,
  type: string
): Promise<JwtPayload | string> => {
  let secret = process.env.JWT_SECRET;

  switch (type) {
    case tokenTypes?.ACCESS:
      secret = process.env.JWT_EMAIL_SECRET;
      break;
    case tokenTypes?.RESET_PASSWORD:
      break;
    case tokenTypes?.REFRESH:
      break;
    case tokenTypes?.VERIFY_EMAIL:
      break;
    default:
      break;
  }

  const payload = jwt.verify(token, secret as string);

  if (!payload) {
    throw new Error("Token not found");
  }
  return payload;
};

const generateAuthTokens = async (
  user: User
): Promise<{
  access: { token: string; expires: Date };
  refresh: { token: string; expires: Date };
}> => {
  const accessTokenExpires = dayjs().add(
    Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES),
    "minutes"
  );
  const accessToken = await generateToken(
    user._id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = dayjs().add(
    Number(process.env.JWT_REFRESH_EXPIRATION_DAYS),
    "days"
  );
  const refreshToken = await generateToken(
    user._id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("No users found with this email");
  }
  const expires = dayjs().add(
    Number(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES),
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );

  return resetPasswordToken;
};

const generateVerifyEmailToken = async (user: User): Promise<string> => {
  const expires = dayjs().add(
    Number(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES),
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user._id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  return verifyEmailToken;
};

export default {
  getPayload,
  generateToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
