const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.SECRET_KEY;

// verify token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (token) {
        const splittedToken = token.split(" ")[1];
        // verify token
        jwt.verify(splittedToken, secretKey, (err, user) => {
            if (err) return res.status(403).json({ message: `Invalid token because ${err}` });
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: "You're not authenticated because no token provided" });
    }
};

// verify token and authenticate user
const verifyTokenAndAuthentication = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }
    });
};

// verify token and status user
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin };
