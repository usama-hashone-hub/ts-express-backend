import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { AuthUser, ResMessage } from "./auth.types";
import authService from "../auth.service";
import {
  AuthInput,
  ChangePasswordInput,
  ForgetInput,
  ForgetInputCode,
  UpdatePasswordInput,
} from "./auth.input";
import userService from "../../user/user.service";
import tokenService from "../token/token.service";
import { UserInput } from "../../user/graphql-apis/user.inputs";
import mqConnection, { RMQ_QUEUES } from "../../../rabbitmq";

@Resolver(() => AuthUser)
export class AuthResolver {
  @Query(() => String)
  async AuthQuery(): Promise<string> {
    return "In Auth Resolver";
  }

  @Mutation(() => AuthUser)
  async Login(@Arg("input") input: AuthInput): Promise<AuthUser> {
    const login = await authService.loginUserWithEmailAndPassword(
      input.email,
      input.password
    );

    // await mqConnection.sendToQueue(RMQ_QUEUES.USERS_QUEUE, {
    //   action: "testFunc",
    //   payload: login,
    // });

    return login;
  }

  @Mutation(() => AuthUser)
  async SignUp(@Arg("input") input: UserInput): Promise<AuthUser> {
    const user = await userService.createUser(input);
    const tokens = await tokenService.generateAuthTokens(user);

    return {
      ...structuredClone(user),
      access: tokens.access,
      refresh: tokens.refresh,
    };
  }

  @Mutation(() => ResMessage)
  async ChangePassword(@Arg("input") input: ChangePasswordInput) {
    const user = await authService.changePassword(input);

    if (user) {
      return { message: "Password change successfully." };
    }
    return user;
  }

  @Mutation(() => String)
  async forgetPassword(@Arg("input") input: ForgetInput) {
    await authService.forgetPassword(input);
    return "Reset password code sent to email.";
  }

  @Mutation(() => String)
  async getForgetPasswordToken(@Arg("input") input: ForgetInputCode) {
    return await authService.verifyForgetPassword(input);
  }

  @Mutation(() => AuthUser)
  async updatePassword(@Arg("input") input: UpdatePasswordInput) {
    return await authService.verifyTokenUpdatePassword(input);
  }
}
