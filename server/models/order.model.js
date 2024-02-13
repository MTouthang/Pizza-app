import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPrice: {
      type: Number,
      require: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['OFFLINE', 'ONLINE'],
      default: 'Offline',
    },
    status: {
      type: String,
      enum: ['ORDERED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'ORDERED',
    },
  },
  {
    timestamps: true,
  }
);

const Order = model('Order', orderSchema);
export default Order;
