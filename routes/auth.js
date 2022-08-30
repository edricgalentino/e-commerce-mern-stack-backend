const routes = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
routes.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
        img: req.body.img,
        phone: req.body.phone,
        address: req.body.address,
        fullname: req.body.fullname,
        isAdmin: req.body.isAdmin,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// LOGIN
routes.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        // check if username exists
        // !user && res.status(401).json({ message: "Username not found!" });
        if (!user) {
            return res.status(401).json({ message: "Username not found!" });
        }
        // decrypt password
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        // check if password is correct
        // decryptedPassword !== req.body.password && res.status(401).json({ message: "Password is incorrect!" });
        if (decryptedPassword !== req.body.password) {
            return res.status(401).json({ message: "Password is incorrect!" });
        }
        // create token
        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "1d" });
        // return user without password
        const { password, ...userWithoutPassword } = user._doc;

        res.status(200).json({ ...userWithoutPassword, accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});

module.exports = routes;
