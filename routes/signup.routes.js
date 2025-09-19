import { Router } from "express";

const signupRouter = Router();

signupRouter("/sign-up", (req, res) => res.redirect("signup.ejs"));

/* 
[
    // password must be at least 8 characters long
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    // password must contain at least one uppercase letter
    body('password').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
    // password must contain at least one number
    body('password').matches(/[0-9]/).withMessage('Password must contain at least one number'),
    // password must contain at least one special character
    body('password').matches(/[\W_]/).withMessage('Password must contain at least one special character')
  ];
*/

export default signupRouter;