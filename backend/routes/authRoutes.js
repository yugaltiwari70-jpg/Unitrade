const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const PendingSignup = require("../models/PendingSignup");

const router = express.Router();


// =========================================================
// EMAIL CONFIGURATION
// =========================================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


// =========================================================
// HELPERS
// =========================================================

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}


function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
}


function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}


function createToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "unitrade_secret",
    {
      expiresIn: "7d",
    }
  );
}


function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    college: user.college,
    course: user.course,
    isVerified: user.isVerified,
  };
}


async function sendOtpEmail(email, otp, type = "login") {
  const subject =
    type === "register"
      ? "UniTrade Email Verification OTP"
      : "UniTrade Login OTP";

  const heading =
    type === "register"
      ? "Verify your UniTrade account"
      : "Verify your UniTrade login";

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject,

    text: `
${heading}

Your UniTrade OTP is: ${otp}

This OTP is valid for 5 minutes.

If you did not request this, you can safely ignore this email.

UniTrade
Student Welfare & Resource Sharing Platform
    `.trim(),

    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;">
        <h2 style="margin-bottom:10px;">♻ UniTrade</h2>

        <h3>${heading}</h3>

        <p>Your verification OTP is:</p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          padding:18px;
          background:#f4f4f4;
          text-align:center;
          border-radius:10px;
          margin:20px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for <b>5 minutes</b>.
        </p>

        <p style="color:#777;">
          If you did not request this, you can safely ignore this email.
        </p>

        <hr />

        <p style="color:#777;">
          UniTrade — Student Welfare & Resource Sharing Platform
        </p>
      </div>
    `,
  });
}


// =========================================================
// REGISTER / CREATE ACCOUNT - REQUEST OTP
// =========================================================

async function requestRegisterOtp(req, res) {
  try {
    const {
      name,
      email,
      password,
      college,
      course,
    } = req.body;

    const normalizedEmail = normalizeEmail(email);

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing verified account
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    // Hash password before storing pending signup
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    // OTP valid for 5 minutes
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Store pending signup
    await PendingSignup.findOneAndUpdate(
      {
        email: normalizedEmail,
      },
      {
        email: normalizedEmail,
        name: String(name).trim(),
        password: hashedPassword,
        college: String(college || "").trim(),
        course: String(course || "").trim(),
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // Send OTP
    await sendOtpEmail(
      normalizedEmail,
      otp,
      "register"
    );

    return res.json({
      message: "Registration OTP sent successfully",
    });

  } catch (error) {
    console.error("Registration OTP error:", error);

    return res.status(500).json({
      message: "Could not send registration OTP",
    });
  }
}


// New endpoint
router.post(
  "/request-register-otp",
  requestRegisterOtp
);


// Keep old /register endpoint safe.
// It NO LONGER creates account directly.
// It only starts OTP verification.
router.post(
  "/register",
  requestRegisterOtp
);


// =========================================================
// REGISTER - VERIFY OTP
// =========================================================

router.post("/verify-register-otp", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Enter the valid 6-digit OTP",
      });
    }

    const pending = await PendingSignup.findOne({
      email,
    });

    if (!pending) {
      return res.status(400).json({
        message:
          "Registration session expired. Please request a new OTP.",
      });
    }

    // Maximum attempts
    if (pending.otpAttempts >= 5) {
      await PendingSignup.deleteOne({
        _id: pending._id,
      });

      return res.status(429).json({
        message:
          "Too many incorrect OTP attempts. Please request a new OTP.",
      });
    }

    // Check expiry
    if (
      !pending.otpExpiresAt ||
      pending.otpExpiresAt.getTime() < Date.now()
    ) {
      await PendingSignup.deleteOne({
        _id: pending._id,
      });

      return res.status(400).json({
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    // Compare OTP
    const submittedHash = hashOtp(otp);

    if (submittedHash !== pending.otpHash) {
      pending.otpAttempts += 1;
      await pending.save();

      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    // Check if verified account appeared meanwhile
    const existingUser = await User.findOne({
      email,
    });

    let user;

    if (existingUser) {
      // Existing unverified account from older version
      // can be safely claimed only after email OTP verification.
      if (existingUser.isVerified) {
        await PendingSignup.deleteOne({
          _id: pending._id,
        });

        return res.status(400).json({
          message:
            "An account with this email already exists",
        });
      }

      existingUser.name = pending.name;
      existingUser.password = pending.password;
      existingUser.college = pending.college;
      existingUser.course = pending.course;
      existingUser.isVerified = true;

      user = await existingUser.save();

    } else {
      // Create the REAL account only after OTP verification
      user = await User.create({
        name: pending.name,
        email: pending.email,
        password: pending.password,
        college: pending.college,
        course: pending.course,
        isVerified: true,
      });
    }

    // Remove pending signup
    await PendingSignup.deleteOne({
      _id: pending._id,
    });

    const token = createToken(user);

    return res.status(201).json({
      message:
        "Account created and email verified successfully",
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error("Verify registration OTP error:", error);

    return res.status(500).json({
      message: "Could not verify registration OTP",
    });
  }
});


// =========================================================
// LOGIN - REQUEST OTP
// =========================================================

router.post("/request-login-otp", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    user.loginOtpHash = otpHash;
    user.loginOtpExpiresAt = otpExpiresAt;
    user.loginOtpAttempts = 0;

    await user.save();

    await sendOtpEmail(
      email,
      otp,
      "login"
    );

    return res.json({
      message: "Login OTP sent successfully",
    });

  } catch (error) {
    console.error("Login OTP error:", error);

    return res.status(500).json({
      message: "Could not send login OTP",
    });
  }
});


// =========================================================
// LOGIN - VERIFY OTP
// =========================================================

router.post("/verify-login-otp", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Enter the valid 6-digit OTP",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid login session",
      });
    }

    if (user.loginOtpAttempts >= 5) {
      user.loginOtpHash = "";
      user.loginOtpExpiresAt = null;
      user.loginOtpAttempts = 0;

      await user.save();

      return res.status(429).json({
        message:
          "Too many incorrect OTP attempts. Please request a new OTP.",
      });
    }

    if (
      !user.loginOtpHash ||
      !user.loginOtpExpiresAt ||
      user.loginOtpExpiresAt.getTime() < Date.now()
    ) {
      return res.status(400).json({
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    const submittedHash = hashOtp(otp);

    if (submittedHash !== user.loginOtpHash) {
      user.loginOtpAttempts += 1;
      await user.save();

      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    // OTP proves ownership of email
    user.isVerified = true;

    // Clear OTP
    user.loginOtpHash = "";
    user.loginOtpExpiresAt = null;
    user.loginOtpAttempts = 0;

    await user.save();

    const token = createToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error("Verify login OTP error:", error);

    return res.status(500).json({
      message: "Could not verify login OTP",
    });
  }
});


// =========================================================
// NORMAL LOGIN
// =========================================================

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});


// =========================================================
// CURRENT USER
// =========================================================

router.get("/me", async (req, res) => {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = header.slice(7);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "unitrade_secret"
    );

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    return res.json({
      user: publicUser(user),
    });

  } catch (error) {
    console.error("Auth /me error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
});


module.exports = router;