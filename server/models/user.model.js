import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      minlength: [5, "Name must be at least 5 characters"],
      lowercase: true,
      trim: true, // Removes unnecessary spaces
      maxlength: [20, "first Name should be not more than 20 characters"]
    },
    lastName: {
      type: String,
      minlength: [5, "Name must be at least 5 characters"],
      lowercase: true,
      trim: true, // Removes unnecessary spaces
      maxlength: [20, "first Name should be not more than 20 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill in a valid email address"
      ] // Matches email against regex
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number should be provided"],
      unique: [true, "Phone number is already in use."],
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false // Will not select password upon looking up a document
    },

    avatar: new Schema(
      {
        imageId: { type: String, required: true },
        url: { type: String, required: true }
      },
      { _id: false }
    ),

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
  },
  {
    timestamps: true
  }
);

// Hashes password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  // method to compare plain password with hashed password and return true or false
  comparePassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  },

  // generate jwt token
  generateJWTToken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        role: this.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY
      }
    );
  },

  generatePasswordResetToken: async function () {
    // creating a random token using node's built-in crypto module
    const resetToken = await crypto.randomBytes(20).toString("hex");

    // Again using crypto module to hash the generated resetToken
    this.forgotPasswordToken = await crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Adding forgot password expiry to 15 minutes
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
    return resetToken;
  }
};

const User = model("User", userSchema);
export default User;
