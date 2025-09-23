import { Router } from "express";
import pool from "../config/db.config.js";
import "dotenv/config";

const upgradeRouter = Router();

upgradeRouter.get("/", (req, res) => res.render("upgrade"));

upgradeRouter.post("/", async (req, res, next) => {
  if (req.body.code == process.env.UPGRADE_CODE) {
    try {
      await pool.query("UPDATE users SET isadmin = TRUE WHERE userid = $1;", [
        res.locals.currentUser.userid,
      ]);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  res.redirect("/");
});
export default upgradeRouter;
