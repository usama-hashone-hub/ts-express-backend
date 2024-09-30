import { AuthChecker } from "type-graphql";
import ApiError from "../utils/ApiError";
import HttpStatus from "../utils/HttpStatus";
import { GraphQLError } from "graphql";

const graphqlAuthChecker: AuthChecker<any> = async (
  { root, args, context, info },
  roles
) => {
  console.log({ user: context.user }, "getting user from context");

  if (!context.user) {
    throw new GraphQLError("Please authenticate", {
      extensions: { code: HttpStatus.UNAUTHORIZED },
    });
  }

  return true;
};

export default graphqlAuthChecker;
