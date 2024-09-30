import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { User } from "../v1/user/user.schema";

const roles = { admin: ["getUsers"], user: ["getUsers"] };

const roleRights = new Map(Object.entries(roles));

const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, user: User) => {
    if (err || !user) {
      return reject(new Error("Please authenticate"));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((right) =>
        userRights?.includes(right)
      );
      // console.log({ requiredRights, hasRequiredRights, userId: req.params.userId, user: user.id });
      if (!hasRequiredRights && req.params.userId !== user._id) {
        return reject(new Error("Forbidden"));
      }
    }

    resolve();
  };

const can =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("in can");
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default can;
