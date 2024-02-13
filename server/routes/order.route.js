import express from 'express';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import { createOrder } from '../controllers/order.controller.js';
const orderRoute = express.Router();

orderRoute.post(
  '/cart/:cartId',
  isLoggedIn,
  authorizeRoles('USER'),
  createOrder
);

export default orderRoute;
