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
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return next(new AppError('Invalid cart ID provided ', 404));
  }

  // Create a new order instance
  const order = new Order({
    user: userId,
    products: cartId, // Assuming products array contains cart IDs
    paymentMethod,
    address,
  });

  // Save the new order to the database
  await order.save();

  // Clear the cart for the user after order creation
  await Cart.findByIdAndDelete(cartId);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order,
  });
});
