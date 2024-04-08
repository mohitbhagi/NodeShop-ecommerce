const wrapAsync = require("../middlewares/wrapAsync.js");
const Review = require("../models/Review.js");
const Product = require("../models/Product.js");

// Create new Review
// Post /review
// Private/Admin

module.exports.createReviewController = wrapAsync(async (req, res) => {
    let { message, rating } = req.body;
    // Find the product
    let { productId } = req.params;
    let productFound = await Product.findById(productId).populate("reviews");
    if(!productFound) {
        throw new Error("Product not found");
    }
    // Check if user already review this product
    const hasReviewed = productFound?.reviews?.find((review) => {
        return review?.user?.toString() === req?.userAuthId?.toString();
    });  
    if(hasReviewed) {
        throw new Error("You have already reviewed this product");
    }
    // Create review
    let review = await Review.create({
        message,
        rating,
        product: productFound?._id,
        user: req.userAuthId,
    });
    // Push review into product found
    productFound.reviews.push(review?._id);
    // resave
    await productFound.save();
    res.status(201).json({
        success: true,
        message: "Review created successfully",
    });
});