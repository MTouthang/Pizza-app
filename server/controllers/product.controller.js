import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import Product from "../models/product.model.js";
import AppError from "../utils/appError.utils.js";
import cloudinary from "cloudinary";
import fs from "fs";

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

  // check if the data is there or not, if not throw error message
  if (
    !productName ||
    !description ||
    !price ||
    !category ||
    !quantity ||
    !inStock
  ) {
    return next(new AppError("All fields are required", 400));
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
      secure_url: "random_url" // for temporary
    }
  });
  // If product not created send message response
  if (!product) {
    return next(new AppError("Fail to create product", 400));
  }

  // run only if product sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "product",
        width: 250,
        height: 250
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
        new AppError(error || "File not uploaded, please try again", 400)
      );
    }
  }

  // If all good send the response to the frontend
  res.status(201).json({
    success: true,
    message: "Product added successfully",
    product
  });
});

export const productDetails = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    next(new AppError("not able to find the product"));
  }

  res.status(200).json({
    success: true,
    message: "successful",
    product
  });
});

export const listProductsOnCategory = asyncHandler(async (req, res, next) => {
  const category = req.params.category;

  const { page, limit } = req.query;

  const PAGE = Number(page) || 1;
  const LIMIT = Number(limit) || 50;
  const startIndex = (PAGE - 1) * LIMIT;
  const endIndex = PAGE * LIMIT;

  const totalUsers = await Product.find({
    category: category
  }).countDocuments();

  const result = {};
  if (endIndex < totalUsers) {
    result.next = {
      pageNumber: PAGE + 1,
      limit: LIMIT
    };
  }

  if (startIndex > 0) {
    result.previous = {
      pageNumber: PAGE - 1,
      limit: LIMIT
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
        ? "Fetch products successfully"
        : "No product found",
    data: result
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  const product = Product.findById(productId);

  if (!product) {
    next(new AppError("not able to find product", 400));
  }

  const update = {};
  update.productName = req.body.productName || product.productName;
  update.description = req.body.description || product.description;
  update.price = req.body.price || product.price;
  update.rating = req.body.rating || product.rating;
  update.category = req.body.category || product.category;
  update.quantity = req.body.quantity || product.quantity;
  update.inStock = req.body.inStock || product.inStock;
  update.productImage = req.user.image || product.productImage;

  if (req.img) {
    product.productImage = req.image;
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: product.id },
    update,
    {
      new: true
    }
  );

  res.status(200).json({
    success: true,
    message: "successfully updated the product",
    updatedProduct
  });
});
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    next(new AppError("not able to delete the product", 400));
  }

  res.status(200).json({
    success: true,
    message: "successfully deleted the product",
    deletedProduct
  });
});
