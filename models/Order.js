// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Generate random numbers for Order
// const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
// const randomNumbers = Math.floor(1000 + Math.random() * 90000);

// const OrderSchema = new Schema(
//     {
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         orderItems: [
//           {
//             type: Object,
//             required: true,
//           },
//         ],
//         shippingAddress: {
//           type: Object,
//           required: true,
//         },
//         orderNumber: {
//           type: String,
//           default: randomTxt + randomNumbers,
//         },
//         //for stripe payment
//         paymentStatus: {
//           type: String,
//           default: "Not paid",
//         },
//         paymentMethod: {
//           type: String,
//           default: "Not specified",
//         },
//         totalPrice: {
//           type: Number,
//           default: 0.0,
//         },
//         currency: {
//           type: String,
//           default: "Not specified",
//         },
//         //For admin
//         status: {
//           type: String,
//           default: "pending",
//           enum: ["pending", "processing", "shipped", "delivered"],
//         },
//         deliveredAt: {
//           type: Date,
//         },
//       },
//       {
//         timestamps: true,
//       }
// );

// const Order = mongoose.model("Order", OrderSchema);

// module.exports = Order;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Generate random numbers for Order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);

const OrderItemSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  totalQtyBuying: Number,
  price: Number,
});

const ShippingAddressSchema = new Schema({
  firstName: String,
  postalAddress: String,
});

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    orderNumber: {
      type: String,
      default: randomTxt + randomNumbers,
    },
    // for stripe payment
    paymentStatus: {
      type: String,
      default: "Not paid",
    },
    paymentMethod: {
      type: String,
      default: "Not specified",
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    currency: {
      type: String,
      default: "Not specified",
    },
    // For admin
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered"],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
