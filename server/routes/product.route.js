import express from "express";
import {
  createProduct,
  productDetails,
  listProductsOnCategory,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import cloudinaryImageUpload from "../middlewares/cloudinaryImageUpload.js";

const productRoute = express.Router();

productRoute.post(
  "/",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  cloudinaryImageUpload("productImage"),
  createProduct
);

productRoute.get(
  "/id/:id",
  isLoggedIn,
  authorizeRoles("USER", "ADMIN"),
  productDetails
);

productRoute.get(
  "/category/:category",
  isLoggedIn,
  authorizeRoles("USER", "ADMIN"),
  listProductsOnCategory
);

productRoute.put(
  "/update-product/:id",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  cloudinaryImageUpload,
  updateProduct
);

productRoute.delete(
  "/update-product/:id",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  deleteProduct
);

export default productRoute;
