import express from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

import {
  addToCart,
  clearCart,
  deleteCart,
  listAllCart,
  removeItemFromCart,
  viewCart,
  viewCartById,
} from "../controllers/cart.controller.js";
const cartRoute = express.Router();

// add product to cart
cartRoute.post(
  "/product/:productId",
  isLoggedIn,
  authorizeRoles("USER"),
  addToCart
);

// list all carts
cartRoute.get("/lists", isLoggedIn, authorizeRoles("ADMIN"), listAllCart);

// view cart details
cartRoute.get("/", isLoggedIn, authorizeRoles("USER", "ADMIN"), viewCart);
cartRoute.get("/:cartId", isLoggedIn, authorizeRoles("ADMIN"), viewCartById);

// clear cart
cartRoute.put("/", isLoggedIn, authorizeRoles("USER"), clearCart);

// delete cart
cartRoute.delete("/:cartId", isLoggedIn, authorizeRoles("ADMIN"), deleteCart);
cartRoute.put(
  "/:itemId",
  isLoggedIn,
  authorizeRoles("USER", "ADMIN"),
  removeItemFromCart
);

export default cartRoute;
