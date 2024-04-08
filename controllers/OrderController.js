const wrapAsync = require("../middlewares/wrapAsync.js");
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const User = require("../models/User.js");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const Coupon = require("../models/Coupon.js");
const { query } = require("express");
dotenv.config();

// desc create order
// route POST /order
// access private

// Stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

module.exports.createOrderController = wrapAsync(async (req, res) => {
    // Get the Coupon
    const { coupon } = req?.query;
    const couponFound = await Coupon.findOne({
      code: coupon?.toUpperCase(),
    });
    if(couponFound?.isExpired) {
      throw new Error("Coupon has expired");
    }
    if(!couponFound) {
      throw new Error("Coupon does't exits");
    }

    // Get discount
    const discount = couponFound?.discount / 100;

    // Get the payload(customer, orderItems, shippingAddress, totalPrice)
    const { orderItemss, shippingAddresss, totalPrice } = req.body;

    const orderItems = JSON.parse(orderItemss);
    const shippingAddress = JSON.parse(shippingAddresss);

    // console.log(orderItems, shippingAddress, totalPrice);
    // Find the user
    const user = await User.findById(req.userAuthId);
    // Check if user has shipping address
    if(!user?.hasShippingAddress) {
        throw new Error("Plese provide shipping address");
    }
    // Check if order is not empty
    if(orderItems?.length <= 0) {
        throw new Error("No order items");
    }
    // Place/Create order - save into DB
    const order = await Order.create({
        user: user._id,
        orderItems,
        shippingAddress,
        totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    });
    console.log(order);

    // Update the product quantity
    const products = await Product.find({ _id: { $in: orderItems } });

    orderItems?.map(async (order) => {
      const product = products?.find((product) => {
        return product?._id.toString() === order?._id.toString();
      });
      if (product) {
        product.totalSold += order.totalQtyBuying;
      }
      await product.save();
    });

    // Push order into user
    user.orders.push(order?._id);
    await user.save();

    // Make payment (stripe)
    // Convert order items to have some structure that stripe need
    const convertedOrders = orderItems.map((item) => {
      return {
          price_data: {
            currency: "CAD",
            product_data: {
              name: item?.name,
              description: item?.description,
            },
            unit_amount: item?.price * 100
          },
          quantity: item?.totalQtyBuying,
      }
    });
    const session = await stripe.checkout.sessions.create({
      line_items: convertedOrders,
      metadata: {
        orderId: JSON.stringify(order?._id)
      },
      mode: "payment",
      success_url: "http://localhost:8080/success",
      cancel_url: "http://localhost:8080/cancel",
    });
    res.send({ url: session.url});

});


// desc get all orders
// route get /order
// access private

module.exports.getAllOrdersController = wrapAsync(async (req, res) => {
  // find all orders
  const orders = await Order.find();
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

// desc get single orders
// route get /order/:id
// access private/admin

module.exports.getSingleOrderController = wrapAsync(async (req, res) => {
  const { id } = req.params;
  let order = await Order.findById(id);
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});

// desc update order to delivered
// route get /order/update/:id
// access private/admin

module.exports.updateOrderController = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedOrder = await Order.findByIdAndUpdate(id, {
    status: req.body.status,
  },
  {
    new: true,
  });
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

// Get statistics of  orders
// GET /order/sales/sum
// private/access

module.exports.getOrderStatsController = wrapAsync(async (req, res) => {
    // get order stats
    const orders = await Order.aggregate([{
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
          minimumSales: {
            $min: "$totalPrice",
          },
          maximumSales: {
            $max: "$totalPrice",
          },
          averageSales: {
            $avg: "$totalPrice",
          }
      }
    }]);

    // Get the Date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const salesToday = await Order.aggregate([{
        $match: {
          createdAt: {
            $gte: today,
          }
        }
    },
    {
        $group: {
            _id: null,
            totalSales: {
                $sum: "$totalPrice",
            }
        }
    }]);
    res.status(200).json({
      success: true,
      message: "Stats of orders",
      orders,
      salesToday,
    });
});