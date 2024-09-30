import { IOptionInput } from "./graphql-apis/user.inputs";
import { UserList } from "./graphql-apis/user.types";
import { User } from "./user.schema";

export abstract class UserStatics {
  public static paginate: (
    filter?: any,
    options?: IOptionInput
  ) => Promise<any>;
  public static deleteById: (userId: string) => Promise<any>;
}

export interface Ioptions {
  sortBy: string;
  limit: string;
  page: string;
}

export interface IUserList {
  results?: User[];
  page?: number;
  limit?: number;
  totalPages?: number;
  totalResults?: number;
}
