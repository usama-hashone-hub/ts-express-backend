// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import userService from "../user.service";
import { UserInput } from "../graphql-apis/user.inputs";
import { IUserList } from "../user.interface";
import { User } from "../user.schema";

@Route("users")
export class UsersController extends Controller {
  @Get("{userId}")
  public async getUser(
    @Path() userId: string,
    @Query() name?: string
  ): Promise<User> {
    return userService.getUserById(userId);
  }

  @Get()
  public async getAllUser(@Query() limit?: number): Promise<IUserList> {
    return userService.getUsers(limit);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(@Body() requestBody: UserInput) {
    this.setStatus(201); // set return status 201
    userService.createUser(requestBody);
    return;
  }
}
