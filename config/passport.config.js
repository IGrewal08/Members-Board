import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import pool from "./db.config.js";

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!match) {
        return done(null, false, { message: "Incorrect password"});
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT userid, email, username, isAdmin FROM users WHERE userId = $1", [id]);
    const user = rows[0];
    done(null, user);
  } catch(error) {
    done(error);
  }
});

export default passport;