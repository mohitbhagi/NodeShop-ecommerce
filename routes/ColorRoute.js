const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn.js");
const isAdmin = require("../middlewares/isAdmin.js");
const { createColorController, getAllColorsController, getSingleColorController, updateColorController, deleteColorController } = require("../controllers/ColorController.js");


router.route("/")
    .post(isLoggedIn, isAdmin, createColorController)
    .get(getAllColorsController)

router.route("/:id")
    .get(getSingleColorController)
    .put(isLoggedIn, isAdmin, updateColorController)    
    .delete(isLoggedIn, isAdmin, deleteColorController)

module.exports = router;