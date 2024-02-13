import express from "express";
import {
  viewProfile,
  updateProfile,
  deleteProfile
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
const userRoute = express.Router();

userRoute.get("/profile", isLoggedIn, viewProfile);
userRoute.put("/profile", isLoggedIn, updateProfile);
userRoute.delete("/profile", isLoggedIn, deleteProfile);

export default userRoute;
