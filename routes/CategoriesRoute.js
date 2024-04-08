const express = require("express");
const router = express.Router();
const multer = require("multer");
const {storage} = require("../config/fileUpload.js");
const upload = multer({ storage });
const { isLoggedIn } = require("../middlewares/isLoggedIn.js");
const { createCategoryController, getAllCategoriesController, getSingleCategoryController, updateCategoryController, deleteCategoryController } = require("../controllers/CategoriesController.js");

router.route("/")
    .post(isLoggedIn, upload.single("file"), createCategoryController)
    .get(getAllCategoriesController)

router.route("/:id")
    .get(getSingleCategoryController)
    .put(updateCategoryController)
    .delete(deleteCategoryController)

module.exports = router;