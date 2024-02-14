import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.utils.js";
import sendEmail from "../utils/sendMail.utils.js";

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

  // logout by clearing cookies
  res.cookie("token", null, {
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 0,
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "User delete in successfully",
    user
  });
});

/**
 *
 * @list-all-user
 * @ROUTE @get {{URL}}/api/v1/list-all-user
 * @return users
 * @ACCESS admin
 *
 */

export const listAllUsers = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;

  const PAGE = Number(page) || 1;
  const LIMIT = Number(limit) || 50;
  const startIndex = (PAGE - 1) * LIMIT;
  const endIndex = PAGE * LIMIT;

  const totalUsers = await User.find().countDocuments();

  const result = {};
  if (endIndex < totalUsers) {
    result.next = {
      pageNumber: PAGE + 1,
      limit: LIMIT
    };
  }

  if (startIndex > 0) {
    result.previous = {
      pageNumber: PAGE - 1,
      limit: LIMIT
    };
  }

  result.users = await User.find()
    .skip(startIndex)
    .limit(LIMIT)
    .sort({ createdAt: 1 });

  return res.status(200).json({
    status: 200,
    success: true,
    message:
      result.users.length > 0 ? "Fetch users successfully" : "No user found",
    data: result
  });
});

/**
 *
 * @get-user
 * @ROUTE @get {{URL}}/api/v1/get-user/:id
 * @return users
 * @ACCESS admin
 *
 */

export const userDerails = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("Not able to fetch the user details", 401));
  }

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user
  });
});

/**
 *
 * @update-user
 * @ROUTE @put {{URL}}/api/v1/update-user/:id
 * @return users
 * @ACCESS admin
 *
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

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
  update.role = req.body.role || user.role;
  update.avatar = req.user.image || update.avatar;

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

export const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const DeletedUser = await User.findById(userId);

  if (!DeletedUser) {
    return next(new AppError("Not able to delete user", 401));
  }

  // sent the resetPasswordUrl to the user email
  const subject = "Delete Account";
  const message = `
  <p>Your account is removed by admin</p>`;

  try {
    await sendEmail(DeletedUser.email, subject, message);

    // if email sent successfully send the success response
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      DeletedUser
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Something went wrong, please try again"),
      500
    );
  }
});

export const createUser = asyncHandler(async (req, res, next) => {});