import express from 'express';
import {
  createProduct,
  productDetails,
  listProductsOnCategory,
  updateProduct,
  deleteProduct,
  listAllProducts,
} from '../controllers/product.controller.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import cloudinaryImageUpload from '../middlewares/cloudinaryImageUpload.js';

const productRoute = express.Router();

productRoute.post(
  '/',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  cloudinaryImageUpload('productImage'),
  createProduct
);

// query limit, page , category (veg, non-veg, drink)
productRoute.get(
  '/list-all-product',
  isLoggedIn,
  authorizeRoles('USER', 'ADMIN'),
  listAllProducts
);

productRoute.get('/product-detail/:id', isLoggedIn, productDetails);

productRoute.get('/category/:category', isLoggedIn, listProductsOnCategory);

productRoute.put(
  '/update-product/:id',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  cloudinaryImageUpload('productImage'),
  updateProduct
);

productRoute.delete(
  '/delete-product/:id',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  deleteProduct
);

export default productRoute;
