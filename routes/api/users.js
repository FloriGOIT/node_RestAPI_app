const express = require("express");
const router = express.Router();
const Joi = require("joi");
const UserDB = require("../../models/usersDb.js");
const verifyToken = require("../../config/validateToken.js");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar'); // newly
const Jimp = require("jimp")
const dotenv = require("dotenv");
dotenv.config();
const path = require("path")
const multer = require('multer');
const fs = require("fs");
const nodemailer = require('nodemailer');
const htmlFisrt = `<html>
                    <body>
                      <h1>Please confirm your account</h1>
                      <h3>In order to confirm your email account, please click on the link below:</h3>
                      <br>
                      <a href="http://localhost:3000/api/users/verify/i6BkvIBzqjVRO2wY87qIt6T7FjOIK8" style="text-decoration: none;">
                        <button style="
                          background-color: yellow; 
                          color: green; 
                          font-weight: bold; 
                          border: none; 
                          padding: 10px 20px; 
                          font-size: 16px;
                          cursor: pointer;">
                          Confirm!
                        </button>
                      </a>
                    </body>
                  </html>`


/* function generateRandomString(length = 30) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
} */
const verificationTokenSet = "i6BkvIBzqjVRO2wY87qIt6T7FjOIK8";
console.log('Received verification token:', verificationTokenSet);

const uploadDir = path.join(process.cwd(), 'tmp');
const storage = multer.diskStorage({
  destination: (req, avatarUpload, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, avatarUpload, cb) => {
    cb(null, avatarUpload.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({storage});


const JoiUserSchema = Joi.object({
  email: Joi.string().required().min(3).max(100).email(),
  password: Joi.string().required().min(8),
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
  const { password, email } = req.body;
  const user = await UserDB.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email already in use",
      data: "Conflict",
    });
  
  } 
  
  else {
    try {
      const gravatarUrl = gravatar.url(email, { s: '250', r: 'pg', d: 'mm' });
      const newUser = await new UserDB({ email, subscription: "starter", avatarURL: gravatarUrl, verify: false, verificationToken: verificationTokenSet });
      await newUser.setPassword(password);
      await newUser.save();

      const nodemailerConfig = {
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.OUTLOOK_EMAIL,
          pass: process.env.OUTLOOK_PASSWORD,
        },
      };
      console.log("nodemailerConfig",nodemailerConfig)

      const transporter = nodemailer.createTransport(nodemailerConfig);
      const emailOptions = {
        from: process.env.OUTLOOK_EMAIL,
        to: email,
        subject: 'Email confirmation',
        html : htmlFisrt
       };

      transporter
        .sendMail(emailOptions)
        .then(info => console.log(info))
        .catch(err => console.log(err));

      return res.status(201).json({
        status: "success",
        code: 201,
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: gravatarUrl
        },
      })
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.get("/users/verify/:verificationToken", async (req, res, next) => {
  try {
    const codeToken = req.params.verificationToken;
    console.log('Received verification token:', codeToken);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log("baseUrl", baseUrl)

    // Find the user by the verification token
    const userConfirmedPrevious = await UserDB.findOne({ confirmationEmail: baseUrl });
    if(userConfirmedPrevious){return res.status(400).json({status: "400 Bad Request", message: "Verification has already been passed"})}
    const user = await UserDB.findOne({ verificationToken: codeToken });

    // If the user is not found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found or token invalid' });
    }

    if (user.UserConfirmed) {
      return res.status(400).json({
        status: 'error',
        message: 'Email has already been confirmed.',
      });
    }

    // Update the user to confirm email
    user.userConfirmed = true;
    user.verificationToken = null; // Optionally clear the token after verification
    user.confirmationEmail = baseUrl;
    await user.save();

    // Return success response
    return res.status(200).json({ message: 'User successfully verified' });

  } catch (error) {
    console.error('Error during user verification:', error);
    return res.status(500).json({ message: 'Server error' });
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
          avatarURL: user.avatarURL
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


router.patch("/users/avatars", verifyToken, upload.single("avatarUpload"), async (req, res, next) => {
  try {
    const user = req.user;
    if (req.tokenValidated === user.token) {
      const newAvatar = req.file;
      const uniqueFileName = `${new Date().getTime()}_${newAvatar.originalname}`;
      const tmpImagePath = path.join(process.cwd(), 'tmp', newAvatar.filename); console.log("tmpImagePath", tmpImagePath)
      const outputImagePath = path.join(process.cwd(), 'public', 'avatars', uniqueFileName); console.log("outputImagePath", outputImagePath)
      Jimp.read(tmpImagePath)
      .then( image => {image.cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
                       image.write(outputImagePath, (err) => {
                        if (err) throw err;
                        console.log('JIMP - Image processed and saved successfully!')})});
      const data = await UserDB.findByIdAndUpdate(
        user.id,
        { avatarURL: `http://localhost:3000/avatars/${uniqueFileName}` }, { new: true }
      );
      user.save();
      fs.unlink(tmpImagePath, (err) => {
        if (err) {console.error('Error deleting the file:', err);return;}
        else{console.log('File deleted successfully')};
    });
      return res.status(200).json({newAvatar: data.avatarURL});
    } else {
      return res.status(404).json({ error: "Not found by token" });
    }
  } catch (eror) {
    return res.status(400).json({ error: "Bad request" });
  }
});


module.exports = router;
