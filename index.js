if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const dbConnect = require("./config/dbConnect.js");
const UserRouter = require("./routes/UserRoute.js");
const ProductRoute = require("./routes/ProductRoute.js");
const CategoriesRoute = require("./routes/CategoriesRoute.js");
const BrandRoute = require("./routes/BrandRoute.js");
const ColorRoute = require("./routes/ColorRoute.js");
const ReviewRoute = require("./routes/ReviewRoute.js");
const OrderRoute = require("./routes/OrderRoute.js");
const CouponRoute = require("./routes/CouponRoute.js");
const Stripe = require("stripe");
const { AllError, ErrorHandling } = require("./middlewares/ErrorHandling.js");
const Order = require('./models/Order.js');

dbConnect();

// Stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_a232d801e8c1e00bd050fa657221922deb24ab9a8b6d83e86b23bd550f533353";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log("event");
  } catch (err) {
    console.log("err", err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type === "checkout.session.completed") {
    // update the order
    const session = event.data.object;
    const { orderId } = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;

    // Find the order
    const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
        totalPrice: totalAmount / 100,
        currency,
        paymentMethod,
        paymentStatus,
    },
    {
        new: true,
    });
    console.log(order);
  } else {
    return;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRouter);
app.use("/product", ProductRoute);
app.use("/category", CategoriesRoute);
app.use("/brand", BrandRoute);
app.use("/color", ColorRoute);
app.use("/review", ReviewRoute);
app.use("/order", OrderRoute);
app.use("/coupon", CouponRoute);

app.get("/", (req, res) => {
    res.redirect("/user");
});

AllError();
ErrorHandling();

app.listen(8080, () => {
    console.log("Listen to port 8080");
});