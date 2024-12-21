const jwt = require("jsonwebtoken");
const USER = require("../schema/userSchema");
const key = process.env.secretKey;

const userAuthentication = async function (req, res, next) {
    try {
        const token = req.cookies.angular;
        // console.log(token);
        if (!token) {
            return res.status(401).json({ Error: "Authentication token missing" });
        }

        const verifyToken = jwt.verify(token, key);
        const rootUser = await USER.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            return res.status(404).json({ Error: "User not found" });
        }

        req.token = token;
        req.user = rootUser;
        req.name = rootUser.fname,
        req.userId = rootUser._id,
        req.isVerified = rootUser.isVerified;

        next();
    } catch (error) {
        console.error("Error during authentication:", error.message);
        return res.status(401).json({ Error: "Invalid or expired token" });
    }
};

module.exports = userAuthentication;
