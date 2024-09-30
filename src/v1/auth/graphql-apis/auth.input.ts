import { Field, InputType } from "type-graphql";

@InputType()
export class AuthInput {
  @Field() email!: string;
  @Field() password!: string;
}

@InputType()
export class ChangePasswordInput {
  @Field() email!: string;
  @Field() currentPassword!: string;
  @Field() newPassword!: string;
}

@InputType()
export class ForgetInput {
  @Field()
  readonly email!: string;
}

@InputType()
export class ForgetInputCode {
  @Field()
  readonly email!: string;
  @Field()
  readonly code!: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field()
  readonly token!: string;
  @Field()
  readonly password!: string;
}
