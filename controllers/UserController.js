const User = require("../models/User.js");
const bcrypy = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");
const { getTokenFromHeader } = require("../utils/getTokenFromHeader.js");
const { verifyToken } = require("../utils/verifyToken.js");

module.exports.registerUserController = async(req, res) => {
    const { fullname, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if(userExists) {
        throw new Error("User already exists");
    }

    const salt = await bcrypy.genSalt(10);
    const hashedPassword = await bcrypy.hash(password, salt);

    const user = await User.create({
        fullname,
        email,
        password: hashedPassword
    });
    res.status(200).json({
        status: "Success",
        message: "User Registered Successfully",
        data: user
    });
};

module.exports.loginUserController = async(req, res) => {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if(userFound && await bcrypy.compare(password, userFound?.password)) {
        console.log("User logged in Successfully");
        res.json({
            status: "Success",
            message: "User logged in Successfully",
            userFound,
            token: generateToken(userFound?._id)
        });
    } else {
        throw new Error("Invalid login credentials");
    }
};

module.exports.getUserProfileCtrl = async(req, res) => {
    // Find the user
    const user = await User.findById(req.userAuthId).populate("orders");
    res.json({
        status: "success",
        message: "User profile fetched successfully",
        user,
    });
}

// Update user shipping address
// PUT user/update/shipping
// Private

module.exports.updateShippingAddressController = async(req, res) => {
    const { firstName, lastName, address, city, postalCode, province, phone } = req.body;
    console.log(firstName, lastName, address, city, postalCode, province, phone);
    const user = await User.findByIdAndUpdate(req.userAuthId, {
        shippingAddress: {
            firstName,
            lastName,
            address,
            city,
            postalCode,
            province,
            phone,
        },
        hasShippingAddress: true,
    },
    {
        new: true,
    });
    res.json({
        status: "success",
        message: "Your shipping address updated successfully",
        user,
    });
}