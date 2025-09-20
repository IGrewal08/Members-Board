import { Router } from "express";
import passport from "../config/passport.config.js";

const loginRouter = Router();

loginRouter.get("/", (req, res) => res.render("login.ejs"));
loginRouter.post("/",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
}), (req, res) => {
    // if valid
    // else if not valid
});

export default loginRouter;