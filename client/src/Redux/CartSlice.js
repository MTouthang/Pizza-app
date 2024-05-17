import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../Helper/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
  cartsData: '',
};

// handle add to cart
export const addProductToCard = createAsyncThunk(
  '/cart/add',
  async (productId) => {
    try {
      const res = axiosInstance.post(`/cart/product/${productId}`);

      toast.promise(res, {
        loading: 'Adding the product to cart',
        success: 'Product added successfully',
        error: 'Failed to add Product to Cart',
      });
      const response = await res;
      return response?.data?.cart;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// get product cart details
export const getCartDetails = createAsyncThunk('/cart/details', async () => {
  try {
    const res = axiosInstance.get(`/cart`);

    toast.promise(res, {
      loading: 'Loading the cart details...',
      success: 'Cart details loaded successfully',
      error: 'Cart empty ',
    });
    const response = await res;
    return response?.data?.cart;
  } catch (error) {
    toast.info('Cart empty');
  }
});

// remove from cart
export const removeFromCart = createAsyncThunk(
  '/cart/remove',
  async (itemId) => {
    try {
      if (itemId) {
        const res = axiosInstance.put(`/cart/${itemId}`);
        toast.promise(res, {
          loading: 'Removing product item...',
          success: 'Product updated..',
          error: 'Failed to remove product item',
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

/**
 * Create slice for the cart
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCartDetails.fulfilled, (state, action) => {
      if (action.payload) {
        state.cartsData = action.payload;
      }
    });
  },
});

export const {} = cartSlice.actions;
export default cartSlice.reducer;
