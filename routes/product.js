const routes = require("express").Router();
const Product = require("../models/Product");
const uploadController = require("../controllers/upload");
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
routes.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// SEARCH PRODUCT
routes.post("/search", async (req, res) => {
    const query = req.query.q;
    // if query is empty return all product
    if (query === "") {
        res.status(200).json({ data: await Product.find(), isFind: true });
    } else {
        try {
            const searchedProduct = await Product.find({ $text: { $search: query } });
            if (searchedProduct.length > 0) {
                res.status(200).json({ data: searchedProduct, isFind: true });
            } else {
                res.status(200).json({ message: "Product not found", isFind: false });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
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

// UPLOAD IMAGE
routes.post("/product-image", verifyTokenAndAuthentication, uploadController.uploadFiles);

// DISPLAY IMAGE
routes.get("/image/:name", uploadController.download);

//GET ALL PRODUCTS
routes.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(6);
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
