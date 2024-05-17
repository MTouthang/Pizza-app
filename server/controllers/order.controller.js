import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import AppError from "../utils/appError.utils.js";
/**
 * @createOrder
 * @desc    Create a new order
 * @route   POST /api/v1/orders/cart/:cartId
 * @access  Private - logged-in user
 */
export const createOrder = asyncHandler(async (req, res, next) => {
  const { paymentMethod, address } = req.body;
  const { cartId } = req.params;
  const userId = req.user.id;

  // Validate the incoming request data
  if (!paymentMethod || !address) {
    return next(new AppError("Missing required fields", 400));
  }

  // make sure the user have cart items
  const cart = await Cart.findOne({ _id: cartId, user: userId });
  if (!cart) {
    return next(new AppError("Invalid cart ID provided ", 404));
  }

  // Create a new order instance
  const order = new Order({
    user: userId,
    quantity: cart.quantity,
    totalPrice: cart.totalPrice,
    items: cart.items,
    paymentMethod,
    address,
  });

  // Save the new order to the database
  const orderDetails = await order.save();

  if (!orderDetails) {
    return next(new AppError("Not create the order", 500));
  }

  // once order is created from the cart, clear the cart items
  cart.items = [];
  cart.quantity = 0;
  cart.totalPrice = 0;
  await cart.save();

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    orderDetails,
  });
});

/**
 * @listAllOrders
 * @desc    list all the users product order
 * @route   GET /api/v1/orders/all
 * @access  Private - admin
 */
export const listAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({});

  return res.status(200).json({
    success: true,
    message: orders ? "Orders fetch successfully" : "Orders not available",
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

  let order = null;
  if (req.user.role === "ADMIN") {
    order = await Order.findByIdAndDelete(orderId);
  } else {
    order = await Order.findOneAndDelete({ _id: orderId, user: req.user.id });
  }

  if (!order) {
    return next(new AppError("Order with the given ID is not available", 404));
  }
  // reset price to zero
  order.totalPrice = 0;
  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order deleted successfully",
    order,
  });
});

/**
 * @orderDetails
 * @desc    view the order details
 * @route   GET /api/v1/order/:orderId
 * @return  order data with success status and message
 * @access  Private - admin & user
 */
export const orderDetails = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  // Determine query based on user role
  const query =
    req.user.role === "ADMIN"
      ? { _id: orderId }
      : { _id: orderId, user: req.user.id };

  const order = await Order.findOne(query).populate([
    {
      path: "items",
    },
  ]);
  // Check if the order exists
  if (!order) {
    return next(new AppError("Order with the given ID is not available", 404));
  }

  // Send success response with order details
  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
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
    return next(new AppError("Order ID is required", 400));
  }

  // Find the order by ID
  let order = await Order.findById(orderId);

  // Check if the order exists
  if (!order) {
    return next(new AppError("Order not found", 404));
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
    message: "Order updated successfully",
    order,
  });
});

/**
 * @getUserOrders
 * @desc    get all the available orders  for a particular user.
 * @route   get /api/v1/order/
 * @return  all the available orders of a user
 * @access  Private - user
 */

export const getUserOrders = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);

  // make sure the user have cart items
  const order = await Order.find({ user: userId }).populate("items");
  if (!order || order.length === 0) {
    return next(new AppError("Order not available  ", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order fetch successfully",
    order,
  });
});
