import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.utils.js";

import sendEmail from "../utils/sendMail.utils.js";
import crypto from "crypto";

const cookieOptions = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000, //  7 days
  httpOnly: true
};

/**
 *
 * @REGISTRATION
 * @des user account registration
 * @ROUTE @POST {{URL}}/api/v1/auth/register
 * @return user's data with success message
 * @ACCESS public
 *
 */
export const registerUser = asyncHandler(async (req, res, next) => {
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

  console.log("user", req.user);
  // create new user data object
  const user = await User.create({
    firstName,
    email,
    password,
    mobileNumber,
    avatar: req.user?.avatar
  });

  // Generating a JWT token
  const token = await user.generateJWTToken();

  // Setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // Setting the token in the cookie with name token along with cookieOptions
  res.cookie("token", token, cookieOptions);

  // If all good send the response to the frontend
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user
  });
});

/**
 * @userLogin
 * @desc User login with email and password
 * @ROUTE @POST {{URL}}/api/v1/auth/login
 * @return access token and user logged in successfully message
 * @ACCESS public
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  // destructuring the necessary data from from req object
  const { email, password } = req.body;

  // check if the user data is available
  if (!email || !password) {
    return next(new AppError("Email and Password are required", 404));
  }

  // Finding the user data with the sent email
  const user = await User.findOne({ email }).select("+password");

  // if no user or sent password do not match then send generic response
  if (!(user && (await user.comparePassword(password)))) {
    return next(
      new AppError("Email or Password do not match or user does not exist", 401)
    );
  }
  // generate JWT token
  const token = await user.generateJWTToken();

  // setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // setting the token in the cookie with the name token along with the cookie option
  res.cookie("token", token, cookieOptions);

  // if all good send the response to the frontend
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user
  });
});

/**
 * @userLogout
 * @desc logout the user
 * @ROUTE @POST {{URL}}/api/v1/auth/logout
 * @return message with user logout successfully
 * @ACCESS private - logged-in user
 */

export const userLogout = asyncHandler(async (req, res, next) => {
  // logout by clearing cookies
  res.cookie("token", null, {
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 0,
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "User Logout successfully"
  });
});

/**
 *
 * @ChangePassword
 * @desc change user account password
 * @ROUTE @POST {{URL}}/api/v1/auth/change-password
 * @return message with password updated or changed
 * @ACCESS private - logged-in user
 *
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  // destructure password
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user; // because of the middleware isLoggedIn

  // check if the field are there or not
  if (!oldPassword || !newPassword) {
    return next(
      new AppError("oldPassword and newPassword should be included", 400)
    );
  }

  // find the user by ID and selecting the password
  const user = await User.findById(id).select("+password");
  let email = user.email;

  // check user is present
  if (!user) {
    return next(new AppError("User not available with the provided ID", 400));
  }

  // check if the old password is correct
  const isValidPassword = await user.comparePassword(oldPassword);

  // throw if error if the old password is not valid
  if (!isValidPassword) {
    return next(new AppError("Invalid Old password provided", 400));
  }

  // setting the new password
  user.password = newPassword;

  // save it to the database
  await user.save();

  // setting the password undefined so that it wont get sent in the response
  user.password = undefined;

  // sent the resetPasswordUrl to the user email
  const subject = "Password updated";
  const message = `This is to confirm that your password has been updated successfully`;

  let mailUpdate = false;

  try {
    await sendEmail(email, subject, message);
    mailUpdate = true;
  } catch (error) {
    mailUpdate = false;
  }

  // if email sent successfully send the success response
  // sent success message
  res.status(200).json({
    success: true,
    message: `Password change successfully with ${
      mailUpdate ? "with mail update" : "with failed mail update"
    }`
  });
});

/**
 *
 * @forgotPassword
 * @desc forgot password incase user forget the password
 * @ROUTE @Post {{URL}}/api/v1/auth/reset
 * @return sent mail to the user email and reset a password
 * @ACCESS public - only user
 *
 */

export const forgotPassword = asyncHandler(async (req, res, next) => {
  // extract  email from the request body
  const { email } = req.body;

  // if no email send email is required
  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  // finding the user via email
  const user = await User.findOne({ email });

  // if no user email found send the message email not found
  if (!user) {
    return next(new AppError("Email not registered", 400));
  }

  // generating reset token
  const resetToken = await user.generatePasswordResetToken();

  // saving the forgotPasswordToken to DB
  await user.save();

  // constructing a url to send the correct data
  /**HERE
   * req.protocol will send if http or https
   * req.get('host') will get the hostname
   * the rest is the route that we will create to verify if token is correct or not
   */
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/reset/${resetToken}`;

  // sent the resetPasswordUrl to the user email
  const subject = "Reset Password";
  const message = `
  <p>You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank"> Reset your password</a>. If the above link does not work for some reason, then copy and paste this link in a new tab:</p>
<p> ${resetPasswordUrl}</p>
<p>If you have not requested this, kindly ignore. Note that the reset token is valid for only 10 minutes.</p>

  `;

  try {
    await sendEmail(email, subject, message);

    // if email sent successfully send the success response
    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    return next(
      new AppError(error.message || "Something went wrong, please try again"),
      500
    );
  }
});

/**
 *
 * @resetPassword
 * @desc allow the user to reset the password
 * @ROUTE @POST {{URL}}/api/v1/auth/reset/:resetToken
 * @return sent mail to the user email and reset a password
 * @ACCESS private - particular user
 *
 */
// TODO: send mail once the user password is reset
export const resetPassword = asyncHandler(async (req, res, next) => {
  // extracting resetToken from req.params object
  const { resetToken } = req.params;

  // extracting password from req.body object
  // TODO:confirm-password can be added
  const { password } = req.body;

  /* we are again hashing the resetToken  using sha256 since we have stored our resetToken in DB using the same algorithm */

  const forgotPasswordToken = crypto
    .createHash("Sha256")
    .update(resetToken)
    .digest("hex");

  // check if password is not there then send response saying password is required.
  if (!password) {
    return next(new AppError("Password is required", 400));
  }

  // checking if token matches in DB and if it is still valid (not expired)
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: {
      $gt: new Date(
        Date.now()
      ) /* $gt will help us check for greater than value, with this we can
      check if token is valid or expired */
    }
  });

  //if not found or expired send the response
  if (!user) {
    return next(
      new AppError("Token is invalid or expired, please try again", 400)
    );
  }

  // update the password if token is valid and not expired
  user.password = password;

  //making forgotPasswordToken and forgotPasswordExpiry to undefined
  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  // sent the resetPasswordUrl to the user email
  const subject = "password updated ";

  let message = `Your password has been change successfully, Recommend to change the password if it is not done by you`;

  try {
    // saving the updated user value
    await user.save();
    await sendEmail(deletedUser.email, subject, message);

    // Sending the response when everything goes good
    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Something went wrong, please try again"),
      500
    );
  }
});
