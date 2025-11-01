import { Router } from "express";
import pool from "../config/db.config.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

const signupRouter = Router();
const validateSignup = [
  body("email")
    .isEmail()
    .notEmpty()
    .withMessage("Must be a valid email address!"),
  body("username")
    .notEmpty()
    .isString()
    .isLength({ min: 2 })
    .withMessage("Username must be at least 2 characters long"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("password")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
  body("password")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  body("password")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Confirm Password and Password do not match"),
];

signupRouter.get("/", (req, res) => res.render("signup"));

signupRouter.post("/", [
  validateSignup,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("signup", {
        errors: errors.array(),
      });
    }
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await pool.query(
        "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)",
        [req.body.email, req.body.username, hashedPassword]
      );
      res.redirect("/");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
]);

export default signupRouter;
