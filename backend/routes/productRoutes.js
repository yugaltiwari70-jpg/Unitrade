const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Product = require("../models/Product");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// IMAGE UPLOAD SETUP
// =====================================================

const uploadDir = path.join(__dirname, "../uploads/products");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const fileName =
      `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, fileName);
  }
});


const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});


// =====================================================
// GET ALL PRODUCTS
// =====================================================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name email college isVerified")
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
});


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email college isVerified");

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    product.views += 1;
    await product.save();

    res.json(product);

  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message: "Failed to fetch product"
    });
  }
});


// =====================================================
// ADD PRODUCT
// =====================================================

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {

      // -----------------------------------------------
      // Logged-in user ID comes from JWT
      // -----------------------------------------------

      const userId = req.user.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({
          message: "User account not found"
        });
      }


      // -----------------------------------------------
      // Form data
      // -----------------------------------------------

      const {
        title,
        description,
        category,
        price,
        condition,
        location,
        contact
      } = req.body;


      // -----------------------------------------------
      // Required fields
      // -----------------------------------------------

      if (
        !title ||
        title.trim() === "" ||
        price === undefined ||
        price === "" ||
        !location ||
        location.trim() === ""
      ) {
        return res.status(400).json({
          message: "Title, price and location are required"
        });
      }


      // -----------------------------------------------
      // Image
      // -----------------------------------------------

      const image = req.file
        ? `/uploads/products/${req.file.filename}`
        : "";


      // -----------------------------------------------
      // Create product
      // -----------------------------------------------

      const product = await Product.create({

        title: title.trim(),

        description: description || "",

        category: category || "Other",

        price: Number(price),

        condition: condition || "Good",

        location: location.trim(),

        image,

        // IMPORTANT:
        // Seller comes from JWT, not frontend
        seller: user._id,

        sellerName: user.name,

        college: user.college || "",

        contact: contact || "",

        isVerifiedSeller: user.isVerified || false

      });


      // -----------------------------------------------
      // Return populated product
      // -----------------------------------------------

      const populatedProduct = await Product.findById(product._id)
        .populate("seller", "name email college isVerified");


      res.status(201).json({
        message: "Product listed successfully",
        product: populatedProduct
      });

    } catch (error) {

      console.error("Add product error:", error);

      res.status(500).json({
        message: error.message || "Failed to add product"
      });
    }
  }
);


// =====================================================
// UPDATE PRODUCT
// =====================================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }


    // Only owner or admin can update
    if (
      product.seller.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only update your own listing"
      });
    }


    const allowedFields = [
      "title",
      "description",
      "category",
      "price",
      "condition",
      "location",
      "contact",
      "status"
    ];


    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });


    await product.save();


    const updatedProduct = await Product.findById(product._id)
      .populate("seller", "name email college isVerified");


    res.json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {

    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product"
    });
  }
});


// =====================================================
// DELETE PRODUCT
// =====================================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }


    // Only owner or admin can delete
    if (
      product.seller.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only delete your own listing"
      });
    }


    // Delete image from server
    if (product.image) {

      const imagePath = path.join(
        __dirname,
        "..",
        product.image
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }


    await Product.findByIdAndDelete(req.params.id);


    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {

    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product"
    });
  }
});


// =====================================================
// MULTER ERROR HANDLER
// =====================================================

router.use((error, req, res, next) => {

  if (error instanceof multer.MulterError) {

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Image must be under 5 MB"
      });
    }

    return res.status(400).json({
      message: error.message
    });
  }


  if (error) {
    return res.status(400).json({
      message: error.message
    });
  }


  next();
});


module.exports = router;