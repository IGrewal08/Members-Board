import express from "express";
import { fileURLToPath } from "node:path";
import path from "node:path";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pgSimple from "connect-pg-simple";

import homeRouter from "./routes/home.routes.js";
import loginRouter from "./routes/login.routes.js";
import signupRouter from "./routes/signup.routes.js"

const app = express();
const pgSession = pgSimple(session);                        // store session data
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.__dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({ 
    secret: "sample", 
    resave: false, 
    saveUninitialized: false 
}));
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/log-in", loginRouter());
app.use("/sign-up", signupRouter());
app.use("/", homeRouter());

app.listen(3000, "localhost", (error) => {
  if (error) {
    throw error;
  }
  console.log("Express App listening on port 3000!");
});
