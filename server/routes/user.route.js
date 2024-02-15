import express from "express";
import {
  viewProfile,
  updateProfile,
  deleteProfile,
  listAllUsers,
  userDerails,
  updateUser,
  deleteUser,
  createUser
} from "../controllers/user.controller.js";

import { isLoggedIn, authorizeRoles } from "../middlewares/auth.middleware.js";

import cloudinaryImageUpload from "../middlewares/cloudinaryImageUpload.js";

const userRoute = express.Router();

userRoute.get("/profile", isLoggedIn, viewProfile);
userRoute.put(
  "/profile",
  isLoggedIn,
  cloudinaryImageUpload("avatar"),
  updateProfile
);
userRoute.delete("/profile", isLoggedIn, deleteProfile);

userRoute.get(
  "/list-all-users",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  listAllUsers
);

userRoute.get(
  "/user-detail/:id",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  userDerails
);

userRoute.put(
  "/update-user/:id",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  cloudinaryImageUpload("avatar"),
  updateUser
);

userRoute.delete(
  "/delete-user/:id",
  isLoggedIn,
  authorizeRoles("ADMIN", "USER"),
  deleteUser
);
userRoute.post(
  "/create-user",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  cloudinaryImageUpload("avatar"),
  createUser
);

export default userRoute;
