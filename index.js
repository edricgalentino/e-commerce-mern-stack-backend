const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/stripe");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(`Error connecting to MongoDB: ${err}`);
    });

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000...");
});
