const express = require("express");
const router = express.Router();
const Joi = require("joi");
const UserDB = require("../../models/usersDb.js");
const verifyToken = require("../../config/validateToken.js");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar'); // newly
const dotenv = require("dotenv");
dotenv.config();

const JoiUserSchema = Joi.object({
  email: Joi.string().required().min(3).max(100).email(),
  password: Joi.string().required().min(8),
  subscription: Joi.string().default("starter"),
});

const JoiUserSubscriptionSchema = Joi.object({
  subscription: Joi.string().required().valid("starter", "pro", "business"),
});

router.get("/users", verifyToken, async (req, res, next) => {
  try {
    const data = await UserDB.find({});
    const currentUserToken = req.user.token;
    console.log("currentUserToken", currentUserToken);
    console.log("tokenValidate", req.tokenValidated);
    if (currentUserToken === req.tokenValidated) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ error: "token no longer in use" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/users/signup", async (req, res, next) => {
  const { error } = JoiUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { password, email, subscription } = req.body;
  const user = await UserDB.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email already in use",
      data: "Conflict",
    });
  } else {
    try {
      const newUser = new UserDB({ email, subscription });
      await newUser.setPassword(password);
      await newUser.save();
      const gravatarUrl = gravatar.url(email, { s: '250', r: 'pg', d: 'identicon' });
      res.status(201).json({
        status: "success",
        code: 201,
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          gravatarUrl: gravatarUrl
        },
      }).render('index', { gravatarUrl });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.post("/users/signin", async (req, res, next) => {
  const { error } = JoiUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { password, email } = req.body;
  const user = await UserDB.findOne({ email });

  if (!user || !(await user.isValidPassword(password))) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect email or password",
      data: {
        message: "Bad Request",
      },
    });
  } else {
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();
    return res.status(200).json({
      message: "You signedIN with success!",
      code: 200,
      data: {
        token,
        user: {
          email: `${email}`,
          subscription: user.subscription,
        },
      },
    });
  }
});

router.post("/users/signout", verifyToken, async (req, res, next) => {
  const user = req.user;
  user.token = "";
  await user.save();
  return res.status(200).json({ message: user });
});

router.get("/users/current", verifyToken, async (req, res, next) => {
  const user = req.user;
  if (req.tokenValidated === user.token) {
    return res.status(200).json({
      user_info: { email: user.email, subscription: user.subscription },
    });
  } else {
    return res.status(404).json({ error: "Not found by token" });
  }
});

router.patch("/users/subscription", verifyToken, async (req, res, next) => {
  try {
    const user = req.user;
    const newSubscription = req.body.subscription;
    if (req.tokenValidated === user.token) {
      const { error } = JoiUserSubscriptionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const data = await UserDB.findByIdAndUpdate(
        user.id,
        { subscription: newSubscription },
        { new: true }
      );
      user.save();
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ error: "Not found by token" });
    }
  } catch (eror) {
    return res.status(400).json({ error: "Bad request" });
  }
});

module.exports = router;
