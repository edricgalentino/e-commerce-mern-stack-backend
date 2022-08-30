const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        img: { type: Object, required: true },
        description: { type: String, required: true },
        category: { type: Array },
        size: { type: Array },
        color: { type: Array },
        stock: { type: Number, required: true },
    },
    { timestamps: true }
);
ProductSchema.index({ name: "text" });

module.exports = mongoose.model("Product", ProductSchema);
