const routes = require("express").Router();
const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("./verifyToken");

//CREATE
routes.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
routes.put("/:userId", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(req.params.userId, {
            $set: req.body,
        });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
routes.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
routes.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
routes.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(8);
        } else if (qCategory) {
            products = await Product.find({ category: qCategory });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = routes;
