const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "UniTrade Backend is running successfully 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/notes", noteRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`UniTrade Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });