import { MiddlewareFn } from "type-graphql";

const LogAccess: MiddlewareFn<any> = async ({ context, info }, next) => {
  const username: string = context.username || "guest";
  if (["Query", "Mutation", "Subcription"].includes(info.parentType.name)) {
    console.log(
      `Logging access: ${username} -> ${info.parentType.name}.${
        info.fieldName
      }: ${new Date()}`
    );
  }
  return next();
};

export default LogAccess;
