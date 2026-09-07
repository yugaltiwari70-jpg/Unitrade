const express = require("express");
const Product = require("../models/Product");

const router = express.Router();


// ================= GET ALL PRODUCTS =================

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


// ================= GET SINGLE PRODUCT =================

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


// ================= ADD PRODUCT =================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      condition,
      image,
      seller,
      sellerName,
      college,
      contact
    } = req.body;

    if (!title || price === undefined || !seller) {
      return res.status(400).json({
        message: "Title, price and seller are required"
      });
    }

    const product = await Product.create({
      title,
      description: description || "",
      category: category || "Other",
      price,
      condition: condition || "Good",
      image: image || "",
      seller,
      sellerName: sellerName || "",
      college: college || "",
      contact: contact || ""
    });

    res.status(201).json({
      message: "Product listed successfully",
      product
    });

  } catch (error) {
    console.error("Add product error:", error);

    res.status(500).json({
      message: "Failed to add product"
    });
  }
});


// ================= UPDATE PRODUCT =================

router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product"
    });
  }
});


// ================= DELETE PRODUCT =================

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

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


module.exports = router;