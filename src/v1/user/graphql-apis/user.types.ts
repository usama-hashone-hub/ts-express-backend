import { ObjectType, Field } from "type-graphql";
import { User } from "../user.schema";

import { Ilist } from "../user.interface";

@ObjectType()
export class UserList implements Ilist {
  @Field(() => [User]) results?: [];
  @Field({ nullable: true }) page?: number;
  @Field({ nullable: true }) limit?: number;
  @Field({ nullable: true }) totalPages?: number;
  @Field({ nullable: true }) totalResults?: number;
}
