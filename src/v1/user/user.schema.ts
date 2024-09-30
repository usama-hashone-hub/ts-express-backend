import {
  DocumentType,
  getModelForClass,
  plugin,
  pre,
  prop,
} from "@typegoose/typegoose";

import * as bcrypt from "bcrypt";
import { Field, ID, ObjectType } from "type-graphql";
import paginate from "../../utils/plugins/pagination.plugin";
import { UserStatics } from "./user.interface";
import { timestampPlugin } from "../../utils/plugins/timestamp.plugin";
import { IsOptional } from "class-validator";

@pre<User>("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
})
@ObjectType()
@plugin(paginate)
@plugin(timestampPlugin)
export class User extends UserStatics {
  @Field(() => ID)
  _id!: string;

  @IsOptional()
  @Field({ nullable: true })
  @prop()
  name!: string;

  @IsOptional()
  @Field({ nullable: true })
  @prop()
  role!: string;

  @IsOptional()
  @Field({ nullable: true })
  @prop({ unique: true })
  email!: string;

  @IsOptional()
  @prop({ required: true })
  password!: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @IsOptional()
  @Field({ nullable: true })
  passwordResetCode?: string;

  @IsOptional()
  @Field({ nullable: true })
  passwordResetExpireAt?: string;

  public static async findByName(
    this: typeof UserModel,
    name: string
  ): Promise<DocumentType<User>[]> {
    return this.find({ name }).exec();
  }

  public static async findByEmail(
    this: typeof UserModel,
    email: string
  ): Promise<DocumentType<User> | null> {
    return this.findOne({ email }).exec();
  }
}

// const UserSchema = buildSchema(User);

export const UserModel = getModelForClass(User);
