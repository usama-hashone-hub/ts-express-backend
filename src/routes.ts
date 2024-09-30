import express, { Router } from "express";
import userRoutes from "./v1/user/rest-apis/user.routes";

const router: Router = express.Router();

interface Route {
  path: string;
  route: Router;
}

const defaultRoutes: Route[] = [
  {
    path: "/user",
    route: userRoutes.userRouter,
  },
];

const devRoutes: Route[] = [
  // routes available only in development mode
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (process.env.NODE_ENV === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
