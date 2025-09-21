import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "./config/passport.config.js";
import "dotenv/config";
import pool from "./config/db.config.js";

import homeRouter from "./routes/home.routes.js";
import loginRouter from "./routes/login.routes.js";
import signupRouter from "./routes/signup.routes.js";

const app = express();
const pgStore = connectPgSimple(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "sample",
    resave: false,
    saveUninitialized: true,
    store: new pgStore({
      pool: pool,
      tableName: process.env.SESSION_NAME,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.user);
  res.locals.currentUser = req.user;
  next();
});

app.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
});
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/", homeRouter);

app.listen(3000, "localhost", (error) => {
  if (error) {
    throw error;
  }
  console.log("Express App listening on port 3000!");
});
