const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin.js");
const { createCouponController, getAllCouponsController, getSingleCouponController, updateCouponController, deleteCouponController } = require("../controllers/CouponController");
const { isLoggedIn } = require("../middlewares/isLoggedIn.js");

router.route("/")
    .post(isLoggedIn, isAdmin, createCouponController)
    .get(getAllCouponsController)

router.route("/:id")
    .get(getSingleCouponController)

router.route("/update/:id")
    .put(isLoggedIn, isAdmin, updateCouponController)

router.route("/delete/:id")
    .delete(isLoggedIn, isAdmin, deleteCouponController)

module.exports = router;