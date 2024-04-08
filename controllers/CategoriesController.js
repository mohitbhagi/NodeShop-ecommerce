const wrapAsync = require("../middlewares/wrapAsync.js");
const Category = require("../models/Category.js");

// Create new Category
// POST /categories
// Private/Admin

module.exports.createCategoryController = wrapAsync(async (req, res) => {
    const { name } = req.body;
    // Category exists
    const categoryFound = await Category.findOne({ name });
    if(categoryFound) {
        throw new Error("Category already exists");
    }
    // create
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req.file.path,
    });
    res.json({
        status: "success",
        message: "Category created successfully",
        category,
    });
});

// Get all Category
// GET /categories
// Public

module.exports.getAllCategoriesController = wrapAsync(async (req, res) => {
    const categories = await Category.find();
    res.json({
        status: "success",
        message: "Category fetched successfully",
        categories,
    });
});

// Get single Category
// Get /categories/:id
// Public

module.exports.getSingleCategoryController = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.json({
        status: "success",
        message: "Category fetched successfully",
        category,
    });
});

// Update Category
// Put /categories/:id
// Private/Admin

module.exports.updateCategoryController = wrapAsync(async(req, res) => {
    const { name } = req.body;
    let { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, {
        name,
    },
    {
        new: true,
    });
    res.json({
        status: "success",
        message: "Category updated successfully",
        category,
    });
});

// Update Category
// Put /categories/:id
// Private/Admin

module.exports.deleteCategoryController = wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({
        status: "success",
        message: "Category deleted successfully",
    });
});