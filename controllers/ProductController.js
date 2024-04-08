const express = require("express");
const Product = require("../models/Product.js");
const Category = require("../models/Category.js");
const Brand = require("../models/Brand.js");

// description create new Product
// route post API
// access Private/admin

module.exports.createProductController = async(req, res) => {
    const convertedImgs = req.files.map((file) => file.path);
    const { name, description, category, sizes, colors, price, totalQty, brand } = req.body;
    // Product exists
    const ProductExists = await Product.findOne({ name });
    if (ProductExists) {
        throw new Error("Product already exists");
    }

    // Find the brand
    const brandFound = await Brand.findOne({
        name: brand?.toLowerCase(),
    });

    if(!brandFound) {
        throw new Error("Brand not found, please create brand first or check brand name");
    }

    // Find the category
    const categoryFound = await Category.findOne({
        name: category,
    });

    if(!categoryFound) {
        throw new Error("Category not found, please create category first or check category name");
    }

    // Create the product
    const product = await Product.create({
        name,
        description,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        brand,
        images: convertedImgs,
    });
    // Push the Product into category
    categoryFound.products.push(product._id);
    // resave
    await categoryFound.save();

    // Push the Product into brand
    brandFound.products.push(product._id);
    // resave
    await brandFound.save();
    // send resposne
    res.json({
        status: "success",
        message: "Product created successfully",
        product,
    });
}

// get all Product
// get product
// access Public

module.exports.getProductsController = async(req, res) => {
    let { name, brand,category, color, size, price } = req.query;
    // query
    let productQuery = Product.find();

    // search by name
    if(name) {
        productQuery = productQuery.find({
            name: { $regex: name, $options: "i" },
        });
    }

    // filter by brand
    if(brand) {
        productQuery = productQuery.find({
            brand: { $regex: brand, $options: "i" },
        });
    }

    // filter by category
    if(category) {
        productQuery = productQuery.find({
            category: { $regex: category, $options: "i" },
        });
    }

    // filter by colors
    if(color) {
        productQuery = productQuery.find({
            colors: { $regex: color, $options: "i" },
        });
    }

    // filter by sizes
    if(size) {
        productQuery = productQuery.find({
            sizes: { $regex: size, $options: "i" },
        });
    }

    // filter by price range
    if(price) {
        const priceRange = price.split("-");
        // gte: greater or equal
        // lte: less than or equal to
        productQuery = productQuery.find({
            price: {$gte: priceRange[0], $lte: priceRange[1]}
        });
    }    

    // pagination
    // page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    // limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    // startIndex
    const startIndex = (page - 1) * limit;
    // endIndex
    const endIndex = page * limit;
    // total
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);

    // pagination results
    const pagination = {};
    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    // await the query
    const products = await productQuery.populate("reviews");

    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: "Products fetched successfully",
        products,
    });
}

// get single Product
// get product/:id
// access Public

module.exports.getProductController = async(req, res) => {
    let { id } = req.params;
    const product = await Product.findById(id).populate("reviews");
    if(!product) {
        throw new Error("Product not found");
    }
    res.json({
        status: "success",
        message: "Product fetched successfully",
        product,
    });
}

// update Product
// get product/:id/update
// access Private/Admin

module.exports.updateProductController = async(req, res) => {
    const { name, description, category, sizes, colors, user, price, totalQty, brand } = req.body;
    let { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, {
        name,
        description,
        category,
        sizes,
        colors,
        user,
        price,
        totalQty,
        brand,
    },
    {
        new: true,
    });
    res.json({
        status: "success",
        message: "Product updated successfully",
        product,
    });
}

// delete Product
// get product/:id/delete
// access Private/Admin

module.exports.deleteProductController = async(req, res) => {
    let { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({
        status: "success",
        message: "Product deleted successfully",
    });
}