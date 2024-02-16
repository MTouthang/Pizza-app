import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [5, 'Product name must be at least 5 characters'],
      trim: true, // Removes unnecessary spaces
      maxlength: [20, 'first Name should be not more than 20 characters'],
    },
    description: {
      type: String,
      minlength: [5, 'Name must be at least 5 characters'],
      maxlength: [60, 'first Name should be not more than 20 characters'],
    },
    productImage: new Schema(
      {
        imageId: { type: String },
        url: { type: String },
      },
      { _id: false }
    ),
    price: {
      type: Number,
      required: [true, 'Price of the product should be provided!'],
    },

    category: {
      type: String,
      enum: ['veg', 'non-veg', 'drink'],
      default: 'veg',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      default: 1,
      max: [99999, 'Quantity cannot be more than 99999'],
    },
    inStock: {
      type: Boolean,
      required: [true, 'In stock status is required'],
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model('Product', productSchema);
export default Product;
