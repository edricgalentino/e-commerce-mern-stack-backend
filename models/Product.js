const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        img: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: Array },
        size: { type: String },
        color: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
