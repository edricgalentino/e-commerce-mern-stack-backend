const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: { type: String },
                quantity: { type: Number, default: 1 },
                size: { type: String, default: "M" },
                color: { type: String, default: "black" },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
