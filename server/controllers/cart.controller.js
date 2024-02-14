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
 * @ROUTE @POST {{URL}}/api/v1/cart/
 * @return cart data
 * @ACCESS private
 *
 */
export const viewCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new AppError('Cart not available', 404));
  }

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
  const { cartId } = req.params;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new AppError('Cart not available', 404));
  }

  /* TODO: instead of delete, update the cart schema so that the items can be remove 
   one by one */
  await Cart.findByIdAndDelete(cartId);

  res.status(200).json({
    success: true,
    message: 'Cart successfully Clear and delete',
  });
});
