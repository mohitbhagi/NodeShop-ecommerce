const wrapAsync = require("../middlewares/wrapAsync.js");
const Brand = require("../models/Brand.js");

// Create new Brand
// POST /brand
// Private/Admin

module.exports.createBrandController = wrapAsync(async (req, res) => {
    const { name } = req.body;
    // Category exists
    const brandFound = await Brand.findOne({ name });
    if(brandFound) {
        throw new Error("Brand already exists");
    }
    // create
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.json({
        status: "success",
        message: "Brand created successfully",
        brand,
    });
});

// Get all Brand
// GET /brand
// Public

module.exports.getAllBrandsController = wrapAsync(async (req, res) => {
    const brand = await Brand.find();
    res.json({
        status: "success",
        message: "Brand fetched successfully",
        brand,
    });
});

// Get single Brand
// Get /brand/:id
// Public

module.exports.getSingleBrandController = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    res.json({
        status: "success",
        message: "Brand fetched successfully",
        brand,
    });
});

// Update Brand
// Put /brand/:id
// Private/Admin

module.exports.updateBrandController = wrapAsync(async(req, res) => {
    const { name } = req.body;
    let { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(id, {
        name,
    },
    {
        new: true,
    });
    res.json({
        status: "success",
        message: "Brand updated successfully",
        brand,
    });
});

// Update Brand
// Put /brand/:id
// Private/Admin

module.exports.deleteBrandController = wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Brand.findByIdAndDelete(id);
    res.json({
        status: "success",
        message: "Brand deleted successfully",
    });
});