import express from 'express';
import { createProduct } from '../controllers/product.controller.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const productRoute = express.Router();

productRoute
  .route('/')
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    upload.single('productImage'),
    createProduct
  );

export default productRoute;
