import express from 'express';
import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  userLogout,
} from '../controllers/auth.controller.js';

import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import cloudinaryImageUpload from '../middlewares/cloudinaryImageUpload.js';
const authRoute = express.Router();

authRoute.post('/register', cloudinaryImageUpload('avatar'), registerUser);
authRoute.post('/login', loginUser);
authRoute.post('/logout', userLogout);

// change password -
authRoute.post(
  '/change-password',
  isLoggedIn,
  authorizeRoles('USER'),
  changePassword
);

// forgot password
authRoute.post('/reset', isLoggedIn, forgotPassword);

// after forgot has generated the reset token
// use the rest token to reset the password
authRoute.post('/reset/:resetToken', resetPassword);

export default authRoute;
