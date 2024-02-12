import express from 'express';
import {
  loginUser,
  registerUser,
  userLogout,
} from '../controllers/auth.controller.js';
import upload from '../middlewares/multer.middleware.js';
const authRoute = express.Router();

authRoute.post('/register', upload.single('avatar'), registerUser);
authRoute.post('/login', loginUser);
authRoute.post('/logout', userLogout);

export default authRoute;
