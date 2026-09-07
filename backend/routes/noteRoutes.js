const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Note = require("../models/Note");

const router = express.Router();

// Upload folder
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".pdf",
    ".ppt",
    ".pptx",
    ".doc",
    ".docx"
  ];

  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF, PPT, PPTX, DOC and DOCX files are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// GET approved notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({
      verificationStatus: "Approved"
    })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email college");

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes",
      error: error.message
    });
  }
});

// GET pending notes — Faculty/Admin use
router.get("/pending", async (req, res) => {
  try {
    const notes = await Note.find({
      verificationStatus: "Pending"
    })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email college");

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending notes",
      error: error.message
    });
  }
});

// Upload note
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a valid file"
      });
    }

    const note = new Note({
      title: req.body.title,
      subject: req.body.subject,
      semester: req.body.semester,
      unit: req.body.unit,
      topic: req.body.topic,
      college: req.body.college,
      description: req.body.description,

      uploadedBy: req.body.uploadedBy || null,
      uploaderName: req.body.uploaderName || "Student",

      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,

      verificationStatus: "Pending"
    });

    await note.save();

    res.status(201).json({
      message: "Note uploaded successfully. Waiting for faculty verification.",
      note
    });
  } catch (error) {
    res.status(500).json({
      message: "Note upload failed",
      error: error.message
    });
  }
});

// Download approved note
router.get("/:id/download", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    if (note.verificationStatus !== "Approved") {
      return res.status(403).json({
        message: "This note is not verified yet"
      });
    }

    if (!fs.existsSync(note.filePath)) {
      return res.status(404).json({
        message: "File not found on server"
      });
    }

    note.downloads += 1;
    note.views += 1;

    await note.save();

    res.download(note.filePath, note.fileName);
  } catch (error) {
    res.status(500).json({
      message: "Download failed",
      error: error.message
    });
  }
});

// Report note
router.post("/:id/report", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    note.reports += 1;
    note.isReported = true;

    await note.save();

    res.json({
      message: "Note reported successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Report failed",
      error: error.message
    });
  }
});

module.exports = router;