import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../Helper/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
  productsData: [],
};

// get all product list
export const getAllProducts = createAsyncThunk(
  '/product/get',
  async ({ limitValue, categoryValue }) => {
    try {
      const res = axiosInstance.get(
        `/product/list-all-product/?limit=${limitValue}&category=${categoryValue}`
      );

      toast.promise(res, {
        loading: 'Loading the product data ...',
        success: 'Product Loaded successfully',
        error: 'Failed to get product',
      });

      const response = await res;
      return response?.data?.data?.products;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }
);

// create or add a new product
export const createNewProduct = createAsyncThunk(
  '/product/add',
  async (productFormData) => {
    console.log(productFormData);
    try {
      const res = axiosInstance.post('/product', productFormData);
      toast.promise(res, {
        loading: 'Creating the new product...',
        success: 'Product added successfully',
        error: 'Failed to add/create course',
      });
      const response = await res;
      console.log(response.data);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// delete or remove the product
export const deleteProduct = createAsyncThunk('/product/delete', async (id) => {
  console.log(id);
  try {
    const res = axiosInstance.delete(`/product/delete-product/${id}`);
    toast.promise(res, {
      loading: 'Deleting/removing the product...',
      success: 'Product deleted/remove successfully',
      error: 'Failed to delete/remove product',
    });
    const response = await res;
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// update the product details
export const updateProduct = createAsyncThunk(
  '/course/update',
  async ({ id, productFormData }) => {
    try {
      const res = axiosInstance.put(
        `/product/update-product/${id}`,
        productFormData
      );

      toast.promise(res, {
        loading: 'Updating the product...',
        success: 'Product updated successfully',
        error: 'Failed to update product',
      });
      const response = await res;

      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// get product details
export const getProductDetails = createAsyncThunk(
  '/product/details',
  async (id) => {
    try {
      const res = axiosInstance.get(`/product/product-detail/${id}`);

      toast.promise(res, {
        loading: 'Loading the product details...',
        success: 'Product loaded successfully',
        error: 'Failed to load the product details',
      });
      const response = await res;

      return response?.data?.product;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

/**
 * Create slice for the product
 */
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      if (action.payload) {
        state.productsData = [...action.payload];
      }
    });
  },
});

export const {} = productSlice.actions;
export default productSlice.reducer;
