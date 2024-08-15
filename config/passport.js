
const passportJWT = require("passport-jwt")
const UserDB = require("../models/usersDb.js")
const dotenv = require('dotenv');
dotenv.config();

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const secret = process.env.JWT_SECRET;

const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}

module.exports = passport => {
    passport.use(
      new Strategy(params, async (payload, done) => {
        try {
          const user = await UserDB.findById(payload.id);
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      })
    );
  
  };
