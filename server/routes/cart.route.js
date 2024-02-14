import express from 'express';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

import {
  addToCart,
  clearCart,
  listAllCart,
  viewCart,
} from '../controllers/cart.controller.js';
const cartRoute = express.Router();

// add product to cart
cartRoute.post(
  '/product/:productId',
  isLoggedIn,
  authorizeRoles('USER'),
  addToCart
);
cartRoute.get('/lists', isLoggedIn, authorizeRoles('ADMIN'), listAllCart);

// view cart details
cartRoute.get(
  '/:cartId',
  isLoggedIn,
  authorizeRoles('USER', 'ADMIN'),
  viewCart
);

cartRoute.put('/', isLoggedIn, authorizeRoles('USER'), clearCart);



export default cartRoute;
