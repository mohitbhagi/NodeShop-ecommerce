const express = require("express");
const router = express.Router();
const multer = require("multer");
const {storage} = require("../config/fileUpload.js");
const upload = multer({ storage });
const wrapAsync = require("../middlewares/wrapAsync.js");
const isAdmin = require("../middlewares/isAdmin.js");
const { createProductController, getProductsController, getProductController, updateProductController, deleteProductController } = require("../controllers/ProductController.js");
const { isLoggedIn } = require("../middlewares/isLoggedIn.js");

router.route("/")
    .post(isLoggedIn, isAdmin, upload.array("files"), wrapAsync(createProductController))
    .get(wrapAsync(getProductsController))

router.route("/:id")
    .get(wrapAsync(getProductController))
    .put(isLoggedIn, isAdmin, wrapAsync(updateProductController))

router.route("/:id/delete")
    .delete(isLoggedIn, isAdmin, wrapAsync(deleteProductController))

module.exports = router;