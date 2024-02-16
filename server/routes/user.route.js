import express from 'express';
import {
  viewProfile,
  updateProfile,
  deleteProfile,
  listAllUsers,
  updateUser,
  deleteUser,
  createUser,
  userDetails,
} from '../controllers/user.controller.js';

import { isLoggedIn, authorizeRoles } from '../middlewares/auth.middleware.js';

import cloudinaryImageUpload from '../middlewares/cloudinaryImageUpload.js';

const userRoute = express.Router();

userRoute.get('/profile', isLoggedIn, authorizeRoles('USER'), viewProfile);
userRoute.put(
  '/profile',
  isLoggedIn,
  authorizeRoles('USER'),
  cloudinaryImageUpload('avatar'),
  updateProfile
);
userRoute.delete('/profile', isLoggedIn, authorizeRoles('USER'), deleteProfile);

userRoute.get(
  '/list-all-users',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  listAllUsers
);

userRoute.get(
  '/user-detail/:id',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  userDetails
);

userRoute.put(
  '/update-user/:id',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  cloudinaryImageUpload('avatar'),
  updateUser
);

userRoute.delete(
  '/delete-user/:id',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  deleteUser
);
userRoute.post(
  '/create-user',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  cloudinaryImageUpload('avatar'),
  createUser
);

export default userRoute;
