const routes = require("express").Router();
const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("./verifyToken");

//CREATE
routes.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
routes.put("/:userId", verifyTokenAndAuthentication, async (req, res) => {
    try {
        const updatedCart = await Cart.findOneAndUpdate(req.params.userId, {
            $set: req.body,
        });
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// REMOVE A PRODUCT FROM CART
routes.delete("/:productId", verifyToken, async (req, res) => {
    try {
        const idx = req.query.index;
        const deletedProduct = await Cart.findOneAndUpdate(req.params.productId, {
            $pull: { products: { idx: { $exists: true } } },
        });
        res.status(200).json("adsadwda");
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
routes.delete("/:id", verifyTokenAndAuthentication, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER CART
routes.get("/find/:userId", verifyTokenAndAuthentication, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// //GET ALL
routes.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = routes;
