import { Router } from "express";
// import userController from "./user.controller";

const userRouter = Router();
/**
 * @swagger
 * /api/getUsers:
 *   get:
 *     summary: Retrieve Users
 *     responses:
 *       200:
 *         description: get users list
 */
// userRouter.get("/getUsers", userController.getUsers);

export default { userRouter };
