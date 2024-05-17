import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.utils.js";
import sendEmail from "../utils/sendMail.utils.js";

/**
 *
 * @viewProfile
 * @desc view user profile
 * @ROUTE @GET {{URL}}/api/v1/profile
 * @return user's data along success status and message
 * @ACCESS private - logged-in user
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
    message: "User profile fetch successfully",
    user,
  });
});

/**
 *
 * @updateProfile
 * @desc Update user profile
 * @ROUTE @put {{URL}}/api/v1/profile
 * @return user's data with success status and message
 * @ACCESS private logged-in user
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(
      new AppError("Unable to fetch the logged-in user details", 401)
    );
  }

  const update = {};
  update.firstName = req.body.firstName || user.firstName;
  update.lastName = req.body.lastName || user.lastName;
  update.mobileNumber = req.body.mobileNumber || user.mobileNumber;
  update.avatar = req.user.avatar || user.avatar;

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user.id },
    update,
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: `User's data updated successfully`,
    updatedUser,
  });
});

/**
 *
 * @deleteProfile
 * @desc delete user profile
 * @ROUTE @delete {{URL}}/api/v1/profile
 * @return deleted user's data
 * @ACCESS private - logged-user
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
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User delete in successfully",
    user,
  });
});

/**
 *
 * @listAllUser
 * @desc list all the available user
 * @ROUTE @GET {{URL}}/api/v1/list-all-user
 * @return users
 * @ACCESS Private only admin
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
      limit: LIMIT,
    };
  }

  if (startIndex > 0) {
    result.previous = {
      pageNumber: PAGE - 1,
      limit: LIMIT,
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
    data: result,
  });
});

/**
 *
 * @userDetails
 * @desc view particular user details
 * @ROUTE @get {{URL}}/api/v1/get-user/:id
 * @return users details
 * @ACCESS private only admin
 *
 */

export const userDetails = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("Not able to fetch the user details", 401));
  }

  res.status(200).json({
    success: true,
    message: "User fetch successful",
    user,
  });
});

/**
 *
 * @updateUser
 * @desc update user details
 * @ROUTE PUT {{URL}}/api/v1/update-user/:id
 * @return user's data along with success status and message
 * @ACCESS Private only admin
 *
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  console.log(userId);

  const user = await User.findById(userId);
  if (!user) {
    return next(
      new AppError("Not able to fetch the logged-in user details", 401)
    );
  }

  const update = { ...req.body };
  if (req.user.avatar) {
    update.avatar = req.user.avatar;
  }

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, update, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    updatedUser,
  });
});

/**
 *
 * @deleteUser
 * @desc delete a particular user
 * @ROUTE PUT {{URL}}/api/v1/delete-user/:id
 * @return deleted user data
 * @ACCESS private only admin
 *
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return next(new AppError("Not able to delete user", 401));
  }

  // sent the resetPasswordUrl to the user email
  const subject = "Delete Account";

  let message = ``;
  if (deletedUser.role === "ADMIN") {
    message = ` <p>Your account is removed by admin 👨‍💼</p>`;
  } else if (deletedUser.role === "USER") {
    message = ` <p>Your account is successfully deleted 🫡</p>`;
  }
  try {
    await sendEmail(deletedUser.email, subject, message);

    // if email sent successfully send the success response
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Something went wrong, please try again"),
      500
    );
  }
});

/**
 *
 * @createUser
 * @desc create user with provided user details
 * @ROUTE POST {{URL}}/api/v1/user/create-user/
 * @return user data with success status and message
 * @ACCESS private only admin
 *
 */
export const createUser = asyncHandler(async (req, res, next) => {
  // extract data
  const { firstName, email, password, mobileNumber } = req.body;

  // check if the data is there or not, if not throw error message
  if (!firstName || !email || !password || !mobileNumber) {
    return next(new AppError("All fields are required", 400));
  }

  // check if the user already exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError("Email already exist", 409));
  }

  // create new user data object
  const user = await User.create({
    firstName,
    email,
    password,
    mobileNumber,
    avatar: req.user.avatar,
  });

  // Setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // sent the resetPasswordUrl to the user email
  const subject = "New Account";
  const message = `
   <h1>successfully created account🥳 </h1> <p><br>  Name : ${firstName}   <br>  Email : ${email}  <br> password : ${password} </p>
   <b>Note: <i>recommend you to update your password 🧑‍💻</i></b>
   
   `;

  try {
    await sendEmail(email, subject, message);

    // if email sent successfully send the success response
    res.status(200).json({
      success: true,
      message: "successfully created the account",
      user,
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Something went wrong, please try again"),
      500
    );
  }
});
