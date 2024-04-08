const express = require("express");
const router = express.Router();
const wrapAsync = require("../middlewares/wrapAsync.js");
const { registerUserController, loginUserController, getUserProfileCtrl, updateShippingAddressController } = require("../controllers/UserController.js");
const { isLoggedIn } = require("../middlewares/isLoggedIn.js");

router.route("/register")
    .post(wrapAsync(registerUserController));

router.route("/login")
    .post(wrapAsync(loginUserController));

router.route("/profile")
    .get(isLoggedIn, wrapAsync(getUserProfileCtrl));

router.route("/update/shipping")
    .put(isLoggedIn, wrapAsync(updateShippingAddressController))

module.exports = router;