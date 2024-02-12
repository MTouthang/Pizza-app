import express from 'express';
import {
  changePassword,
  loginUser,
  registerUser,
  userLogout,
} from '../controllers/auth.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
const authRoute = express.Router();

authRoute.post('/register', upload.single('avatar'), registerUser);
authRoute.post('/login', loginUser);
authRoute.post('/logout', userLogout);
authRoute.post('/change-password', isLoggedIn, changePassword);

export default authRoute;
