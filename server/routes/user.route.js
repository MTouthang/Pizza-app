import express from 'express';
import { registerUser } from '../controllers/user.controller.js';
import upload from '../middlewares/multer.middleware.js';
const userRoute = express.Router();

userRoute.post('/register', upload.single('avatar'), registerUser);

export default userRoute;
