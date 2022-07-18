const routes = require("express").Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// GET ALL USERS
routes.get("/", verifyTokenAndAuthentication, async (req, res) => {
    const query = req.query.new;
    try {
        const user = query ? await User.find().sort({ _id: -1 }).limit(3) : await User.find({});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET USER BY TOKEN
routes.get("/find/:token", async (req, res) => {
    try {
        // decode token with jwt
        const decoded = jwt.verify(req.params.token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        const { password, ...userWithoutPassword } = user._doc;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET USER BY ID
routes.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...userWithoutPassword } = user._doc;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE USER
routes.put("/:id", verifyTokenAndAuthentication, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE USER BY ID
routes.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User has been deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET USER STATS
routes.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.getFullYear() - 1, 0, 1);
    try {
        const stats = await User.aggregate([
            {
                $match: { createdAt: { $gte: lastYear } },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = routes;
