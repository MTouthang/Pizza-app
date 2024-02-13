import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import Product from '../models/product.model.js';
import AppError from '../utils/appError.utils.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

/**
 *
 * @createProduct
 * @ROUTE @POST {{URL}}/api/v1/products/
 * @return product's data with success message
 * @ACCESS private
 *
 */
export const createProduct = asyncHandler(async (req, res, next) => {
  // extract data
  const { productName, description, price, category, quantity, inStock } =
    req.body;
  console.log(req.body);

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
  const product = await Product.create({
    productName,
    description,
    price,
    category,
    quantity,
    inStock,
    productImage: {
      public_id: 135, // for temporary
      secure_url: 'random_url', // for temporary
    },
  });
  // If product not created send message response
  if (!product) {
    return next(new AppError('Fail to create product', 400));
  }

  // run only if product sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'product',
        width: 250,
        height: 250,
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in DB
        product.productImage.public_id = result.public_id;
        product.productImage.secure_url = result.secure_url;

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`, (error) => {
          console.log(error);
        });
        // Save the product object
      }
      await product.save();
    } catch (error) {
      return next(
        new AppError(error || 'File not uploaded, please try again', 400)
      );
    }
  }

  // If all good send the response to the frontend
  res.status(201).json({
    success: true,
    message: 'Product added successfully',
    product,
  });
});
