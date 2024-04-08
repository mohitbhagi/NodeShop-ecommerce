const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn.js");
const isAdmin = require("../middlewares/isAdmin.js");
const { createBrandController, getAllBrandsController, getSingleBrandController, updateBrandController, deleteBrandController } = require("../controllers/BrandController.js");

router.route("/")
    .post(isLoggedIn, isAdmin, createBrandController)
    .get(getAllBrandsController)

router.route("/:id")
    .get(getSingleBrandController)
    .put(isLoggedIn, isAdmin, updateBrandController)
    .delete(isLoggedIn, isAdmin, deleteBrandController)

module.exports = router;