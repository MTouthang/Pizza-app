import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.utils.js";
import cloudinary from "cloudinary";

/**
 *
 * @VIEW-PROFILE
 * @ROUTE @get {{URL}}/api/v1/profile
 * @return user's data
 * @ACCESS private
 *
 */

export const viewProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(
      new AppError("Not able to fetch the logged-in user details", 401)
    );
  }
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user
  });
});

/**
 *
 * @update-PROFILE
 * @ROUTE @put {{URL}}/api/v1/profile
 * @return user's data
 * @ACCESS private
 */

export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(
      new AppError("Not able to fetch the logged-in user details", 401)
    );
  }

  const update = {};
  update.firstName = req.body.firstName || user.firstName;
  update.lastName = req.body.lastName || user.lastName;
  update.mobileNumber = req.body.mobileNumber || user.mobileNumber;
  update.avatar = req.body.avatar || user.avatar;

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user.id },
    update,
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    updatedUser
  });
});

/**
 *
 * @delete-PROFILE
 * @ROUTE @delete {{URL}}/api/v1/profile
 * @return user's data
 * @ACCESS private
 *
 */

export const deleteProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findByIdAndDelete({ _id: userId });
  if (!user) {
    return next(new AppError("Not able to delete user", 401));
  }

  res.status(200).json({
    success: true,
    message: "User delete in successfully",
    user
  });
});
