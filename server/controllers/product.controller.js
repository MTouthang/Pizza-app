import { query } from 'express';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import Product from '../models/product.model.js';
import AppError from '../utils/appError.utils.js';

/**
 *
 * @createProduct
 * @desc create Product
 * @ROUTE @POST {{URL}}/api/v1/products/
 * @return product's data with success message
 * @ACCESS private - only admin
 *
 */
export const createProduct = asyncHandler(async (req, res, next) => {
  // extract data
  const { productName, description, price, category, quantity, inStock } =
    req.body;

  // check if the data is there or not, if not throw error message
  if (
    !productName ||
    !description ||
    !price ||
    !category ||
    !quantity ||
    !inStock
  ) {
    return next(new AppError('All fields are required', 400));
  }

  // create new product data object
  const productInfo = await Product.create({
    productName,
    description,
    price,
    category,
    quantity,
    inStock,
    productImage: req.user.productImage,
  });

  // If product not created send message response
  const product = await productInfo.save();

  if (!product) {
    return next(new AppError('Fail to create product', 400));
  }

  // If all good send the response to the frontend
  res.status(201).json({
    success: true,
    message: 'Product added successfully',
    product,
  });
});

/**
 *
 * @listAllProducts
 * @desc list all products will pagination and category
 * @route @GET {{URL}}/api/v1/products/list-all-product/?page=1&limit=3&category=veg
 * @return product's data with success status and message
 * @ACCESS public user and admin
 *
 */
export const listAllProducts = asyncHandler(async (req, res, next) => {
  const { page, limit, category } = req.query;
  const PAGE = Number(page) || 1;
  const LIMIT = Number(limit) || 50;
  const startIndex = (PAGE - 1) * LIMIT;
  const endIndex = PAGE * LIMIT;

  const query = {};
  category ? (query.category = category) : category;

  const totalUsers = await Product.find(query).countDocuments();

  const result = {};
  if (endIndex < totalUsers) {
    result.next = {
      pageNumber: PAGE + 1,
      limit: LIMIT,
    };
  }

  if (startIndex > 0) {
    result.previous = {
      pageNumber: PAGE - 1,
      limit: LIMIT,
    };
  }

  result.products = await Product.find(query)
    .skip(startIndex)
    .limit(LIMIT)
    .sort({ createdAt: 1 });

  return res.status(200).json({
    status: 200,
    success: true,
    message:
      result.products.length > 0
        ? 'Fetch products successfully'
        : 'No product found',
    data: result,
  });
});

/**
 *
 * @productDetail
 * @desc particular product details
 * @ROUTE @GET {{URL}}/api/v1/products/product-detail/:id
 * @return product's data with success status and message
 * @ACCESS public
 *
 */
export const productDetails = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    next(new AppError('not able to find the product'));
  }

  res.status(200).json({
    success: true,
    message: 'successful',
    product,
  });
});

/**
 *
 * @listProductsOnCategory
 * @desc list all the product base on category
 * @ROUTE @GET {{URL}}/api/v1/products/category/:category
 * @return product's data with success status and message
 * @ACCESS public
 *
 */

export const listProductsOnCategory = asyncHandler(async (req, res, next) => {
  const category = req.params.category;

  const { page, limit } = req.query;

  const PAGE = Number(page) || 1;
  const LIMIT = Number(limit) || 50;
  const startIndex = (PAGE - 1) * LIMIT;
  const endIndex = PAGE * LIMIT;

  const totalUsers = await Product.find({
    category: category,
  }).countDocuments();

  const result = {};
  if (endIndex < totalUsers) {
    result.next = {
      pageNumber: PAGE + 1,
      limit: LIMIT,
    };
  }

  if (startIndex > 0) {
    result.previous = {
      pageNumber: PAGE - 1,
      limit: LIMIT,
    };
  }

  result.users = await Product.find({ category: category })
    .skip(startIndex)
    .limit(LIMIT)
    .sort({ createdAt: 1 });

  return res.status(200).json({
    status: 200,
    success: true,
    message:
      result.users.length > 0
        ? 'Fetch products successfully'
        : 'No product found',
    data: result,
  });
});

/**
 *
 * @UpdateProduct
 * @desc Update product details
 * @ROUTE @put {{URL}}/api/v1/products/update-product/:id
 *  @return updated product's data with success message
 * @ACCESS Private only admin
 *
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('not able to find product', 400));
  }

  const update = {};
  update.productName = req.body.productName || product.productName;
  update.description = req.body.description || product.description;
  update.price = req.body.price || product.price;
  update.category = req.body.category || product.category;
  update.quantity = req.body.quantity || product.quantity;
  update.inStock = req.body.inStock || product.inStock;
  update.productImage = req.user.image || product.productImage;

  if (req.user.productImage) {
    update.productImage = req.user.productImage;
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: product.id },
    update,
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    message: 'successfully updated the product',
    updatedProduct,
  });
});

/**
 *
 * @DeleteProduct
 * @desc delete product
 * @ROUTE DELETE {{URL}}/api/v1/products/delete-product/:id
 * @return delete product's data with success status and message
 * @ACCESS private only admin
 *
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    return next(new AppError('not able to delete the product ', 400));
  }

  res.status(200).json({
    success: true,
    message: 'successfully deleted the product',
    deletedProduct,
  });
});
