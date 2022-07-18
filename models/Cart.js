const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        total: { type: Number, required: true },
        quantity: { type: Number, required: true },
        products: [
            {
                productId: { type: String },
                name: { type: String },
                quantity: { type: Number, default: 1 },
                size: { type: String, default: "M" },
                color: { type: String, default: "black" },
                img: { type: String },
                price: { type: String },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
