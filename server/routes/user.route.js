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

import upload from "../middlewares/multer.middleware.js";
import { isLoggedIn, authorizeRoles } from "../middlewares/auth.middleware.js";

const userRoute = express.Router();

userRoute.get("/profile", isLoggedIn, viewProfile);
userRoute.put("/profile", isLoggedIn, updateProfile);
userRoute.delete("/profile", isLoggedIn, deleteProfile);

userRoute.get(
  "/list-all-users",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  listAllUsers
);

userRoute.get(
  "/get-user/:user-id",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  userDerails
);
userRoute.put(
  "/update-user/:user-id",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  updateUser
);
userRoute.delete(
  "/delete-user/:user-id",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  deleteUser
);
userRoute.post("create-user/", isLoggedIn, authorizeRoles("ADMIN"), createUser);
export default userRoute;