import Cart from '../models/cart.model.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import Product from '../models/product.model.js';
import AppError from '../utils/appError.utils.js';

/**
 *
 * @addToCart
 * @ROUTE @POST {{URL}}/api/v1/cart/product/:productId
 * @return Product cart successfully created message
 * @ACCESS private
 *
 */
// TODO: decrement product quantity when it's added to cart
// TODO: count for same product being added.
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  // Find the product by productId
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check if the user already has a cart
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    // If cart doesn't exist, create a new one
    cart = new Cart({ user: req.user.id, items: [] });
  }

  // Check if the product is already in the cart
  const existingItemIndex = cart.items.findIndex((item) => {
    return item.toString() === productId;
  });

  if (existingItemIndex === -1) {
    cart.items.push(productId);
  }

  // Update total price and quantity of the cart
  cart.quantity += 1;
  cart.totalPrice += product.price;

  // Save the updated cart
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Product added to cart successfully',
    cart,
  });
});

/**
 *
 * @viewCart
 * @desc view product cart
 * @ROUTE @POST {{URL}}/api/v1/cart/:cartId
 * @return cart data
 * @ACCESS private
 *
 */
export const viewCart = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;

  // Determine query based on user role
  const query =
    req.user.role === 'ADMIN' ? { _id: cartId } : { user: req.user.id };

  // Find the cart
  const cart = await Cart.findOne(query);

  // Check if the cart exists
  if (!cart) {
    return next(new AppError('Cart not available with the given cart ID', 404));
  }

  // Send response
  res.status(200).json({
    success: true,
    cart,
  });
});

/**
 *
 * @clearCart
 * @desc clear product cart
 * @ROUTE @POST {{URL}}/api/v1/cart/:cartId
 * @return cart successfully clear
 * @ACCESS private
 *
 */
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new AppError('Cart not available', 404));
  }

  // clearing the items
  cart.items = [];
  cart.quantity = 0;
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart successfully Clear and delete',
  });
});

/**
 *
 * @listAllCart
 * @desc list all the product carts of the users
 * @ROUTE @POST {{URL}}/api/v1/cart/lists
 * @return cart data
 * @ACCESS private
 *
 */
export const listAllCart = asyncHandler(async (req, res, next) => {
  const carts = await Cart.find({});
  res.status(200).json({
    success: true,
    message: carts ? 'carts fetch successfully' : 'No cart available',
    carts,
  });
});

/**
 *
 * @deleteCart
 * @desc delete product cart of the user
 * @ROUTE @DELETE {{URL}}/api/v1/cart/:cartId
 * @return cart data
 * @ACCESS private - admin
 *
 */

export const deleteCart = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  const cart = await Cart.findByIdAndDelete(cartId);

  if (!cart) {
    return next(new AppError('cart not available', 404));
  }

  return res.status(200).json({
    success: true,
    message: "User's product cart deleted successfully",
  });
});
