import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import User from '../models/user.model.js';
import AppError from '../utils/appError.utils.js';
import cloudinary from 'cloudinary';

import fs from 'fs';

/**
 *
 * @REGISTRATION
 * @ROUTE @POST {{URL}}/api/v1/register
 * @return user's data
 * @ACCESS public
 *
 */

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production' ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000, //  7 days
  httpOnly: true,
};

export const registerUser = asyncHandler(async (req, res, next) => {
  // extract data
  const { firstName, email, password, mobileNumber } = req.body;

  // check if the data is there or not, if not throw error message
  if (!firstName || !email || !password || !mobileNumber) {
    return next(new AppError('All fields are required', 400));
  }

  // check if the user already exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError('Email already exist', 409));
  }

  // create new user data object
  const user = await User.create({
    firstName,
    email,
    password,
    mobileNumber,
    avatar: {
      public_id: 135,
      secure_url: 'random_url',
    },
  });
  // If user not created send message response
  if (!user) {
    return next(
      new AppError('User registration failed, please try again later', 400)
    );
  }

  // run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'users-manage',
        width: 250,
        height: 250,
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`, (error) => {
          console.log(error);
        });
        // Save the user object
      }
      await user.save();
    } catch (error) {
      return next(
        new AppError(error || 'File not uploaded, please try again', 400)
      );
    }
  }

  // Generating a JWT token
  const token = await user.generateJWTToken();

  // Setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // Setting the token in the cookie with name token along with cookieOptions
  res.cookie('token', token, cookieOptions);

  // If all good send the response to the frontend
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  });
});

/**
 * @userLogin
 * @ROUTE @POST {{URL}}/api/v1/user/login
 * @return access token and user logged in successfully message
 * @ACCESS public
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  // destructuring the necessary data from from req object
  const { email, password } = req.body;

  // check if the user data is available
  if (!email || !password) {
    return next(new AppError('Email and Password are required', 404));
  }

  // Finding the user data with the sent email
  const user = await User.findOne({ email }).select('+password');

  // if no user or sent password do not match then send generic response
  if (!(user && (await user.comparePassword(password)))) {
    return next(
      new AppError('Email or Password do not match or user does not exist', 401)
    );
  }
  // generate JWT token
  const token = await user.generateJWTToken();

  // setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // setting the token in the cookie with the name token along with the cookie option
  res.cookie('token', token, cookieOptions);

  // if all good send the response to the frontend
  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    user,
  });
});

/**
 * @userLogout
 * @ROUTE @POST {{URL}}/api/v1/user/logout
 * @return message with user logout successfully
 * @ACCESS private
 */

export const userLogout = asyncHandler(async (req, res, next) => {
  // logout by clearing cookies
  res.cookie('token', null, {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User Logout successfully',
  });
});

/**
 *
 * TODO: send mail after password is changes successfully
 * @ChangePassword
 * @ROUTE @POST {{URL}}/api/v1/user/change-password
 * @return message with password updated or changed
 * @ACCESS private
 *
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  // destructure password
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user; // because of the middleware isLoggedIn

  // check if the field are there or not
  if (!oldPassword || !newPassword) {
    return next(
      new AppError('oldPassword and newPassword should be included', 400)
    );
  }

  // find the user by ID and selecting the password
  const user = await User.findById(id).select('+password');

  // check user is present
  if (!user) {
    return next(new AppError('User not available with the provided ID', 400));
  }

  // check if the old password is correct
  const isValidPassword = await user.comparePassword(oldPassword);

  // throw if error if the old password is not valid
  if (!isValidPassword) {
    return next(new AppError('Invalid Old password provided', 400));
  }

  // setting the new password
  user.password = newPassword;

  // save it to the database
  await user.save();

  // setting the password undefined so that it wont get sent in the response
  user.password = undefined;

  // sent success message
  res.status(200).json({
    success: true,
    message: 'User password updated successfully',
  });
});

/**
 *
 * @forgotPassword
 * @ROUTE @Post {{URL}}/api/v1/user/reset
 * @return sent mail to the user email and reset a password
 * @ACCESS public
 *
 */

export const forgotPassword = asyncHandler(async (req, res, next) => {
  // extract  email from the request body
  const { email } = req.body;

  // if no email send email is required
  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  // finding the user via email
  const user = await User.findOne({ email });

  // if no user email found send the message email not found
  if (!user) {
    return next(new AppError('Email not registered', 400));
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
    'host'
  )}/api/v1/user/reset/${resetToken}`;

  // TODO: only the token can be sent to the user mail

  // sent the resetPasswordUrl to the user email
  const subject = 'Reset Password';
  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank"> Reset your password</a>\n if the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n if you have not request this, kindly ignore.`;

  try {
    await sendEmail(email, subject, message);

    // if email sent successfully send the success response
    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    return next(
      new AppError(error.message || 'Something went wrong, please try again'),
      500
    );
  }
});
