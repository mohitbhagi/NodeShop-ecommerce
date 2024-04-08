const { getTokenFromHeader } = require("../utils/getTokenFromHeader.js");
const { verifyToken } = require("../utils/verifyToken.js");

module.exports.isLoggedIn = (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req);
    // verify the token
    const decodedUser = verifyToken(token);
    if(!decodedUser) {
        throw new Error("Invalid Expired/invalid, please login again");
    } else {
        // save the user into req obj
        req.userAuthId = decodedUser?.id;
        next();
    }
}