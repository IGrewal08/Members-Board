import { Router } from "express";

const loginRouter = Router();

loginRouter.get("/log-in", (req, res) => res.redirect("login.ejs"));

export default loginRouter;