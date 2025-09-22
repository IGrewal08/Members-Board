import { Router } from "express";
import * as homeController from "../controllers/home.controller.js";

const homeRouter = Router();

homeRouter.get("/", homeController.getHome);
homeRouter.get("/post/create", homeController.getPostForm);
homeRouter.post("/post/create", homeController.postPostForm);
homeRouter.get("/post/:id", homeController.getPost);
homeRouter.post("/post/:id/comment", homeController.postComment);

export default homeRouter;
