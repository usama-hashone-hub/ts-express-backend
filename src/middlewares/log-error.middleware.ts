import { MiddlewareFn } from "type-graphql";

export const ErrorInterceptor: MiddlewareFn<any> = async (
  { context, info },
  next
) => {
  try {
    return await next();
  } catch (err) {
    // Write error to file log
    // fileLog.write(err, context, info);

    // Hide errors from db like printing sql query
    // if (someCondition(err)) {
    //   throw new Error("Unknown error occurred!");
    // }

    console.log("==================================");
    console.log(err, "Error Logs");
    console.log("==================================");

    // Rethrow the error
    throw err;
  }
};
