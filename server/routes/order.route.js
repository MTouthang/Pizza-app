import express from 'express';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import {
  createOrder,
  deleteOrder,
  listAllOrders,
  orderDetails,
  updateOrder,
} from '../controllers/order.controller.js';
const orderRoute = express.Router();

// create order
orderRoute.post(
  '/cart/:cartId',
  isLoggedIn,
  authorizeRoles('USER'),
  createOrder
);

// list all orders
orderRoute.get('/', isLoggedIn, authorizeRoles('ADMIN'), listAllOrders);
// view order details
orderRoute.get(
  '/:orderId',
  isLoggedIn,
  authorizeRoles('USER', 'ADMIN'),
  orderDetails
);

orderRoute.delete(
  '/:orderId',
  isLoggedIn,
  authorizeRoles('USER', 'ADMIN'),
  deleteOrder
);

// update order only admin
orderRoute.put('/:orderId', isLoggedIn, authorizeRoles('ADMIN'), updateOrder);

export default orderRoute;
