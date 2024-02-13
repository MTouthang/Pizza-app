import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
    paymentMethod: {
      type: String,
      enum: ['OFFLINE', 'ONLINE'],
      default: 'OFFLINE',
    },
    status: {
      type: String,
      enum: ['ORDERED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'ORDERED',
    },
    address: {
      type: String,
      minlength: [
        10,
        "Address character's length should consist of more than 10",
      ],
      required: [true, 'Address is required'],
      maxlength: [60, 'Address Name should be not more than 60 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const Order = model('Order', orderSchema);
export default Order;
