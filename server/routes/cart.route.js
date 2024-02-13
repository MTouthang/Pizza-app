import express from 'express';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

import { addToCart } from '../controllers/cart.controller.js';
const cartRoute = express.Router();

cartRoute.post(
  '/product/:productId',
  isLoggedIn,
  authorizeRoles('USER'),
  addToCart
);

export default cartRoute;
