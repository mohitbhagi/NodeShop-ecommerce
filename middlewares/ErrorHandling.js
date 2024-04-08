const express = require("express");
const app = express();
const ExpressError = require("../middlewares/ExpressError");

let AllError = () => {
    app.all("*", (req, res, next) => {
        next(new ExpressError(404, "Page not found"));
    });
}

let ErrorHandling = () => {
    app.use((err, req, res, next) => {
        let { statusCode = 500, message = "Something went wrong" } = err;
        res.status(statusCode).json({
            message
        })
    });
}

module.exports = { AllError, ErrorHandling };