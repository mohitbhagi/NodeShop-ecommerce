const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn.js");
const { createOrderController, getAllOrdersController, getSingleOrderController, updateOrderController, getOrderStatsController } = require("../controllers/OrderController.js");

router.route("/")
    .post(isLoggedIn, createOrderController)
    .get(isLoggedIn, getAllOrdersController)

router.route("/:id")
    .get(isLoggedIn, getSingleOrderController)
    
router.route("/update/:id")
    .put(isLoggedIn, updateOrderController)

router.route("/sales/sum")
    .get(isLoggedIn, getOrderStatsController)

module.exports = router;    