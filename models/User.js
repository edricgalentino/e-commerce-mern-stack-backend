const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        fullname: { type: String },
        email: { type: String, required: true },
        password: { type: String, required: true },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        // make img with Object type
        img: { type: Object },
        phone: { type: String },
        address: { type: String },
    },
    { timestamps: true }
);
UserSchema.index({ username: "text", fullname: "text" });

module.exports = mongoose.model("User", UserSchema);
