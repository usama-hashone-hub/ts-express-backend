import { Field, ObjectType } from "type-graphql";
import { User } from "../../user/user.schema";

@ObjectType()
class Token {
  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  expires?: Date;
}

@ObjectType()
export class AuthUser extends User {
  @Field({ nullable: true })
  access?: Token;

  @Field({ nullable: true })
  refresh?: Token;
}

@ObjectType()
export class ResMessage {
  @Field({ nullable: true })
  message?: string;
}
