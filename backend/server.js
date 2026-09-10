const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// =========================
// CORS CONFIGURATION
// =========================
const allowedOrigins = [
  "https://unitrade-orcin.vercel.app",
  "http://localhost:5173",
  "http://localhost:5176"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // (for example, direct browser/API requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =========================
// ROOT ROUTE
// =========================
app.get("/", (req, res) => {
  res.json({
    message: "UniTrade Backend is running successfully 🚀"
  });
});

// =========================
// API ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/notes", noteRoutes);

// =========================
// MONGODB + SERVER
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`UniTrade Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });