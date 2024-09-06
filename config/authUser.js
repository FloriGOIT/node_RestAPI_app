// Not in use

/*
const jwt = require("jsonwebtoken");
const UserDB = require("../models/usersDb");
const passport = require("passport")
require("dotenv").config();

const authorizationJWT = (req, res, next) => {
    passport.authenticate("jwt", {session: false}, (err, user) => {
         if(!user || err){return res.status(401).json({error: "Not authorized due to authorizationJWT"})}
         else{req.user = user;
              next()}
    })(req, res, next)
   }
   


const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader & authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if(!token){ return res.status(401).json({
        message: "No token provided or invalid format",
      });}
      else{
        try{const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserDB.findById(decodeToken.id);
            if(!user){return res.status(401).json({message: "User not found",});}
            else{req.user = user; next()}
        }
        catch(error){console.error("Token verification error:", error.message);
                    res.status(401).json({message: "Not authorized",});}
      }
  }; 

  module.exports = authorizationJWT
  */