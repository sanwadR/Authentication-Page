const mongoose = require("mongoose"); // ----> Due to this we can USE all the mongoDB queries
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const keysecret = "iliketakobellqswdefrgthyjukilog";

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: { type: String, required: true, minlenght: 8 },
  cpassword: { type: String, required: true, minlenght: 8 },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//hash password

userSchema.pre("save", async function (next) {
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 12);
  this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  

  next();
});

//Token Generate
userSchema.methods.generateAuthtoken = async function () {
  try {
    let token1 = jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token: token1 });
    await this.save();
    return token1;
  } catch (error) {
    throw new Error(error);
  }
};
//creating model
const userdb = new mongoose.model("User", userSchema);

module.exports = userdb;
