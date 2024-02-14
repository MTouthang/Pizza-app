import express from 'express';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

import {
  addToCart,
  clearCart,
  viewCart,
} from '../controllers/cart.controller.js';
const cartRoute = express.Router();

cartRoute.post(
  '/product/:productId',
  isLoggedIn,
  authorizeRoles('USER'),
  addToCart
);

cartRoute.get('/', isLoggedIn, authorizeRoles('USER', 'ADMIN'), viewCart);
cartRoute.delete(
  '/:cartId',
  isLoggedIn,
  authorizeRoles('USER', 'ADMIN'),
  clearCart
);

export default cartRoute;
