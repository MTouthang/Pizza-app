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
          next(new AppError(`${error}`, 500));
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
