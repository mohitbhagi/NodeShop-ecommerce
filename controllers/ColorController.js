const wrapAsync = require("../middlewares/wrapAsync.js");
const Color = require("../models/Color.js");

// Create new Color
// POST /color
// Private/Admin

module.exports.createColorController = wrapAsync(async (req, res) => {
    const { name } = req.body;
    // Category exists
    const colorFound = await Color.findOne({ name });
    if(colorFound) {
        throw new Error("Color already exists");
    }
    // create
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.json({
        status: "success",
        message: "Color created successfully",
        color,
    });
});

// Get all Colors
// GET /color
// Public

module.exports.getAllColorsController = wrapAsync(async (req, res) => {
    const colors = await Color.find();
    res.json({
        status: "success",
        message: "Color fetched successfully",
        colors,
    });
});

// Get single Color
// Get /color/:id
// Public

module.exports.getSingleColorController = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const color = await Color.findById(id);
    res.json({
        status: "success",
        message: "Color fetched successfully",
        color,
    });
});

// Update Color
// Put /color/:id
// Private/Admin

module.exports.updateColorController = wrapAsync(async(req, res) => {
    const { name } = req.body;
    let { id } = req.params;
    const color = await Color.findByIdAndUpdate(id, {
        name,
    },
    {
        new: true,
    });
    res.json({
        status: "success",
        message: "Color updated successfully",
        color,
    });
});

// Update Color
// Put /color/:id
// Private/Admin

module.exports.deleteColorController = wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Color.findByIdAndDelete(id);
    res.json({
        status: "success",
        message: "Color deleted successfully",
    });
});