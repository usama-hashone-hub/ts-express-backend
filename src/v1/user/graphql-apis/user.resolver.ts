import { Query, Resolver, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { UserInput, UserUpdate } from "./user.inputs";
import userService from "../user.service";
import { User } from "../user.schema";
import { UserList } from "./user.types";
import userQueue, { JobType } from "../bull-queues/default.queue";
import mqConnection, { RMQ_QUEUES } from "../../../rabbitmq";

@Resolver(() => User)
export class UsersResolver {
  @Query(() => UserList)
  async getUsers(@Ctx() context: any) {
    const usersList = await userService.getUsers(10);
    console.log(usersList);
    return usersList;
  }

  @Query(() => User)
  async getUser(@Arg("id") id: string) {
    const user = userService.getUserById(id);
    return user;
  }

  @Query(() => String)
  async TestBullQueue() {
    const addJob = await userQueue.add(
      JobType.DEFAULT_USER,
      { jobId: "1", title: "H=Job to test Bull queue" },
      { delay: 0 }
    );
    return "job requested successfully";
  }

  @Query(() => String)
  async TestRabbitMq() {
    mqConnection.sendToQueue(RMQ_QUEUES.USERS_QUEUE, {
      action: "testFunc",
      payload: { job1: 2, titile: "This job from rabbitmq" },
    });
    return "job requested successfully";
  }

  @Mutation(() => User)
  async createUser(@Arg("input") input: UserInput) {
    const user = await userService.createUser(input);
    return user;
  }

  @Authorized()
  @Mutation(() => User)
  async updateUser(
    @Ctx("user") ctx_user: User,
    @Arg("input") input: UserUpdate
  ) {
    const user = await userService.updateUserById(ctx_user._id, input);

    return user;
  }
}
