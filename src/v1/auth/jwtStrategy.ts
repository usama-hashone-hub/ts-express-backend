import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptionsWithoutRequest,
  VerifiedCallback,
  VerifyCallback,
} from "passport-jwt";
import tokenTypes from "../../utils/tokens";
import { UserModel } from "../user/user.schema";
import { JwtPayload } from "jsonwebtoken";

const jwtOptions: StrategyOptionsWithoutRequest = {
  secretOrKey: process.env.JWT_SECRET as string,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify: VerifyCallback = async (
  payload: JwtPayload,
  done: VerifiedCallback
) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await UserModel.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
