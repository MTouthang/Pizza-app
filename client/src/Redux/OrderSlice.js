import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../Helper/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
  ordersData: null,
};

// handle add to cart
export const placeOrder = createAsyncThunk(
  'cart/placeOrder',
  async ({ cartId, detail }) => {
    try {
      const res = axiosInstance.post(`/order/cart/${cartId}`, detail);

      toast.promise(res, {
        loading: 'Placing an order...',
        success: 'Order placed successfully',
        error: 'Failed to place the order',
      });

      const response = await res;

      return response?.data?.order;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to place the order'
      );
    }
  }
);

// handle individual order details
export const getOrderDetails = createAsyncThunk(
  '/product/order',
  async (orderId) => {
    try {
      const res = axiosInstance.get(`order/${orderId}`);
      toast.promise(res, {
        loading: 'Loading the order details...',
        success: 'Order details loaded successfully',
        error: 'Failed to load the Cart details',
      });

      const response = await res;
      return response?.data?.order;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// handle all the available orders of a particular user
export const loggedInUserOrder = createAsyncThunk(
  '/product/order',
  async () => {
    try {
      const res = axiosInstance.get(`/order`);
      toast.promise(res, {
        loading: 'Loading the order details...',
        success: 'Order details loaded successfully',
        error: 'Cart empty',
      });

      const response = await res;

      return response?.data?.order;
    } catch (error) {
      toast.info('Card empty');
    }
  }
);

// handle all the available orders of a particular user
export const cancelOrder = createAsyncThunk(
  '/product/order/cancel',
  async ({ id, status }) => {
    try {
      const res = axiosInstance.put(`/order/${id}`, { status });

      toast.promise(res, {
        loading: 'Cancelling the order...',
        success: 'Order cancelled  successfully',
        error: 'Failed to cancel the order ',
      });

      const response = await res;

      return response?.data?.order;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// handle product update
export const updateOrder = createAsyncThunk(
  '/product/order',
  async ({ id, formOrder }) => {
    try {
      const res = axiosInstance.put(`/order/${id}`, formOrder);
      toast.promise(res, {
        loading: 'updating the order details...',
        success: 'Order details updated successfully',
        error: 'Failed to update the order details',
      });

      const response = await res;

      return response?.data?.order;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// handle all the available orders of a particular user
export const deleteOrder = createAsyncThunk('/product/order', async (id) => {
  console.log(id);
  try {
    const res = axiosInstance.delete(`/order/${id}`);
    toast.promise(res, {
      loading: 'Delete the order details...',
      success: 'Order details deleted successfully',
      error: 'Failed to delete the order details',
    });

    const response = await res;

    return response?.data?.order;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});
/**
 * Create slice for the order
 */
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      if (action.payload) {
        state.ordersData = action.payload;
      }
    });
  },
});

export const {} = orderSlice.actions;
export default orderSlice.reducer;
