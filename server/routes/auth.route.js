import express from 'express';
import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  userLogout,
} from '../controllers/auth.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
const authRoute = express.Router();

authRoute.post('/register', upload.single('avatar'), registerUser);
authRoute.post('/login', loginUser);
authRoute.post('/logout', userLogout);

// change password -
authRoute.post('/change-password', isLoggedIn, changePassword);

// forgot password
authRoute.post('/reset', isLoggedIn, forgotPassword);

// after forgot has generated the reset token
// use the rest token to reset the password
authRoute.post('/reset/:resetToken', resetPassword);

export default authRoute;
