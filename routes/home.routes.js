import { Router } from "express";
import * as homeController from "./controllers/home.controller.js";

const homeRouter = Router();

homeRouter.get("/", homeController.getHome());
homeRouter.get("/post/create", homeController.getPostForm());
homeRouter.get("/post/:id", homeController.getPost());

export default homeRouter;
