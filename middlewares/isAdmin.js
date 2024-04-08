const User = require("../models/User.js");

const isAdmin = async (req, res, next) => {
    // find the user login
    const user = await User.findById(req.userAuthId);

    // Check if Admin
    if(user.isAdmin) {
        next();
    } else {
        next(new Error("Access denied, admin only"));
    }
}

module.exports = isAdmin;