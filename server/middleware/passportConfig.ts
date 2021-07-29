import bcrypt from "bcrypt"
import User from "../models/user"
const localStrategy = require("passport-local").Strategy

module.exports = function (passport: any) {
    passport.use(
      new localStrategy((email: string, password: string, done: any) => {
        User.findOne({ email: email }, (err: any, user: any) => {
          if (err) throw err;
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err: any, result: boolean) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      })
    );
  };