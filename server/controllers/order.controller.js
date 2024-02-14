import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import Cart from '../models/cart.model.js';
import Order from '../models/order.model.js';
import AppError from '../utils/appError.utils.js';
/**
 * @createOrder
 * @desc    Create a new order
 * @route   POST /api/v1/orders/:cartId
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res, next) => {
  const { paymentMethod, address } = req.body;
  const { cartId } = req.params;
  const userId = req.user.id;

  // Validate the incoming request data
  if (!paymentMethod || !address) {
    return next(new AppError('Missing required fields', 400));
  }

  // make sure the user have cart items
  const cart = await Cart.findOne({ _id: cartId, user: userId }).populate([
    {
      path: 'items',
    },
  ]);
  if (!cart) {
    return next(new AppError('Invalid cart ID provided ', 404));
  }

  // Create a new order instance
  const order = new Order({
    user: userId,
    productDetails: cart,
    paymentMethod,
    address,
  });

  console.log('order', order);
  // Save the new order to the database
  const orderDetails = await order.save();

  if (!orderDetails) {
    return next(new AppError('Not create the order', 500));
  }

  // await Cart.findOneAndDelete({ _id: cartId, user: userId });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    orderDetails,
  });
});

/**
 * @listAllOrders
 * @desc    list all the users product order
 * @route   GET /api/v1/orders/
 * @access  Private - admin
 */
export const listAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({});

  return res.status(200).json({
    success: true,
    message: orders ? 'Orders fetch successfully' : 'Orders not available',
    orders,
  });
});

/**
 * @deleteOrder
 * @desc    delete the user product order
 * @route   DELETE /api/v1/order/:orderId
 * @return  object with success true or false with message
 * @access  Private - admin & user
 */
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    return next(new AppError('Order with the given ID is not available', 404));
  }

  return res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
  });
});

/**
 * @orderDetails
 * @desc    view the order details
 * @route   GET /api/v1/order/:orderId
 * @return  object with success true or false, message and order data
 * @access  Private - admin & user
 */
export const orderDetails = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  // Determine query based on user role
  const query =
    req.user.role === 'ADMIN'
      ? { _id: orderId }
      : { _id: orderId, user: req.user.id };

  // TODO: populate product details
  const order = await Order.findOne(query).populate([
    {
      path: 'productDetails.items',
    },
  ]);

  // Check if the order exists
  if (!order) {
    return next(new AppError('Order with the given ID is not available', 404));
  }

  console.log(order);

  // Send success response with order details
  res.status(200).json({
    success: true,
    message: 'Order fetched successfully',
    order,
  });
});

/**
 * @updateOrder
 * @desc    update order details
 * @route   PUT /api/v1/order/:orderId
 * @return  object with success true or false, message and updated order data
 * @access  Private - admin
 */

export const updateOrder = asyncHandler(async (req, res, next) => {
  const { paymentMethod, status, address } = req.body;

  const { orderId } = req.params;

  // Check if the orderId is provided
  if (!orderId) {
    return next(new AppError('Order ID is required', 400));
  }

  // Find the order by ID
  let order = await Order.findById(orderId);

  // Check if the order exists
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Update the order properties
  if (paymentMethod) {
    order.paymentMethod = paymentMethod;
  }
  if (status) {
    order.status = status;
  }
  if (address) {
    order.address = address;
  }

  // Save the updated order
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    order,
  });
});
