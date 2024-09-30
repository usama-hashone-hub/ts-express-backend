import { buildSchema, NonEmptyArray } from "type-graphql";
import graphqlAuthChecker from "./middlewares/graphql-auth-checker.middleware";
import LogAccess from "./middlewares/log-access.middlewae";
import { ErrorInterceptor } from "./middlewares/log-error.middleware";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { UsersResolver } from "./v1/user/graphql-apis/user.resolver";
import tokenService from "./v1/auth/token/token.service";
import { AuthResolver } from "./v1/auth/graphql-apis/auth.resolver";

export const Resolvers = [
  UsersResolver,
  AuthResolver,
] as NonEmptyArray<Function>;

export const GraphqlServer = async () => {
  const schema = await buildSchema({
    resolvers: Resolvers,
    emitSchemaFile: true,
    authChecker: graphqlAuthChecker,
    globalMiddlewares: [LogAccess, ErrorInterceptor],
  });

  const server = new ApolloServer({
    schema,
    introspection: true,
  });

  const { url } = await startStandaloneServer(server, {
    listen: {
      port: Number(process.env.GRAPHQL_PORT),
    },
    context: async ({ req }) => {
      const token = req.headers.authorization;

      let { user } = await tokenService.getPayload(token as string);

      return { user };
    },
  });

  return url;
};
