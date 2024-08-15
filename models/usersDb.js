const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchemaDb = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});
userSchemaDb.methods.setPassword = async function (password) {
  this.password = await bcryptjs.hash(password, 10);
};

userSchemaDb.methods.isValidPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

const UserDB = mongoose.model("UserDB", userSchemaDb);

module.exports = UserDB;
