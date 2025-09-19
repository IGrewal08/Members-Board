import { Router } from "express";

const signupRouter = Router();

signupRouter("/sign-up", (req, res) => res.redirect("signup.ejs"));

export default signupRouter;