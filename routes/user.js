const routes = require("express").Router();
const User = require("../models/User");
const uploadController = require("../controllers/upload");
const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { db } = require("../models/User");

// GET ALL USERS
routes.get("/", verifyTokenAndAuthentication, async (req, res) => {
    const query = req.query.new;
    try {
        const user = query ? await User.find().sort({ _id: -1 }).limit(3) : await User.find({});
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// GET USER BY SEACRH
// routes.get("/search/:input", verifyTokenAndAuthentication, async (req, res) => {
//     const query = req.params.input;
//     try {
//         const user = await User.find({
//             $or: [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
//         });
//         return res.status(200).json(user);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

// GET USER BY TOKEN
routes.get("/find/:token", async (req, res) => {
    try {
        // decode token with jwt
        const decoded = jwt.verify(req.params.token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        const { password, ...userWithoutPassword } = user._doc;
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// SEARCH USER
routes.post("/search", async (req, res) => {
    const query = req.query.q;
    // if query is empty return all users
    if (query === "") {
        return res.status(200).json({ data: await User.find(), isFind: true });
    } else {
        try {
            const searchedUser = await User.find({ $text: { $search: query } });
            if (searchedUser.length > 0) {
                return res.status(200).json({ data: searchedUser, isFind: true });
            } else {
                return res.status(200).json({ message: "User not found", isFind: false });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
});

// UPLOAD IMAGE
routes.post("/profile-pict", verifyTokenAndAuthentication, uploadController.uploadFiles);

// DISPLAY IMAGE
routes.get("/image/:name", uploadController.download);

// GET USER BY ID
routes.get("/find-user/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...userWithoutPassword } = user._doc;
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// UPDATE USER
routes.put("/:id", verifyTokenAndAuthentication, async (req, res) => {
    // if (req.body.password) {
    //     req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
    // }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        const { password, ...userWithoutPassword } = updateUser._doc;
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// DELETE USER BY ID
routes.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "User has been deleted!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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
        return res.status(200).json(stats);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = routes;
