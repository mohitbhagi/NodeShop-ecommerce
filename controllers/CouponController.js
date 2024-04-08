const wrapAsync = require("../middlewares/wrapAsync");
const Coupon = require("../models/Coupon.js");

// Create new Coupon
// Post /coupon
// Private/Admin

module.exports.createCouponController = wrapAsync(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;
    console.log(code, startDate, endDate, discount)
    // Check if admin
    // Check if coupon already exists
    const checkExists = await Coupon.findOne({ code });
    if(checkExists) {       
        throw new Error("Coupon already exists");
    }
    // Check if discount is a number
    if(isNaN(discount)) {
        throw new Error("Discount value must be a number");
    }
    // Create Coupon
    const coupon = await Coupon.create({
        code: code?.toUpperCase(),
        startDate,
        endDate,
        discount,
        user: req.userAuthId,
    });
    // Send the response
    res.status(201).json({
        status: "success",
        message: "Coupon create successfully",
        coupon,
    });
});

// Get all Coupon
// Get /coupon
// Private/Admin

module.exports.getAllCouponsController = wrapAsync(async (req, res) => {
    const coupons = await Coupon.find();
    res.json({
        status: "success",
        message: "All coupons fetched successfully",
        coupons,
    });
});

// Get single Coupon
// Get /coupon/:id
// Private/Admin

module.exports.getSingleCouponController = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    res.json({
        status: "success",
        message: "Coupon fetched successfully",
        coupon,
    });
});

// Update Coupon
// Get /coupon/update/:id
// Private/Admin

module.exports.updateCouponController = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { code, startDate, endDate, discount } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(id, {
        code: code?.toUpperCase(),
        startDate,
        endDate,
        discount,
    },
    {
        new: true,
    });
    res.json({
        status: "success",
        message: "Coupon updated successfully",
        coupon,
    });
});

// Delete Coupon
// Get /coupon/delete/:id
// Private/Admin

module.exports.deleteCouponController = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    res.json({
        status: "success",
        message: "Coupon deleted successfully",
        coupon,
    });
});