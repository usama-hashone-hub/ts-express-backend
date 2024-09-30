import { User, UserModel } from "./user.schema";
import { UserInput, UserUpdate } from "./graphql-apis/user.inputs";
import { DocumentType } from "@typegoose/typegoose";

const getUsers = async (limit: number | undefined) => {
  const users = await UserModel.paginate();
  return users;
};

const createUser = async (UserData: UserInput): Promise<User> => {
  return await UserModel.create(UserData);
};

const getUserById = (id: string): Promise<User | null> => {
  return UserModel.findById(id).exec();
};

const getUserByEmail = (email: string): Promise<User | null> => {
  return UserModel.findOne({ email }).exec();
};

const testFunc = async (payload: any) => {
  console.log("In test fundtion", payload);
};

const updateUserById = (id: string, body: UserUpdate): Promise<User | null> => {
  return UserModel.findByIdAndUpdate(id, body, { new: true });
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  getUserByEmail,
  testFunc,
};
