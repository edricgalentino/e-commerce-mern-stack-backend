const mongoose = require("mongoose");

const UploadImageSchema = new mongoose.Schema(
    {
        imageName: { type: String },
        imagePath: { type: String },
        imageType: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UploadImage", UploadImageSchema);
