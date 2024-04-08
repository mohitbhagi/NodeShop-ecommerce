const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn.js");
const { createReviewController } = require("../controllers/ReviewController.js");

router.route("/:productId")
    .post(isLoggedIn, createReviewController)

module.exports = router;