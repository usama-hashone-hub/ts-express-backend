import { Field, InputType } from "type-graphql";
import { User } from "../user.schema";

@InputType()
export class UserInput implements Pick<User, "name" | "email"> {
  @Field()
  name!: string;
  @Field()
  email!: string;
  @Field()
  password!: string;
  @Field()
  role!: string;
}

@InputType()
export class UserUpdate {
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  password?: string;
}

@InputType()
export class ForgetPasswordCodeUpdate {
  @Field({ nullable: true })
  passwordResetCode?: number;
  @Field({ nullable: true })
  passwordResetExpireAt?: string;
}

@InputType()
export class IOptionInput {
  @Field()
  sortBy!: string;
  @Field()
  limit!: number;
  @Field()
  page!: number;
}
