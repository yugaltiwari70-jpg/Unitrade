const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const PendingSignup = require("../models/PendingSignup");

const router = express.Router();


// =========================================================
// EMAIL CONFIGURATION - GMAIL SMTP
// =========================================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,

  auth: {
    user: process.env.SMTP_FROM,
    pass: process.env.SMTP_PASS,
  },
});


// =========================================================
// SEND OTP EMAIL
// =========================================================

async function sendOtpEmail(email, otp, type = "login") {
  const subject =
    type === "register"
      ? "UniTrade Email Verification OTP"
      : "UniTrade Login OTP";

  const heading =
    type === "register"
      ? "Verify your UniTrade account"
      : "Verify your UniTrade login";


  // Check required environment variables

  if (!process.env.SMTP_FROM) {
    throw new Error("SMTP_FROM is missing");
  }

  if (!process.env.SMTP_PASS) {
    throw new Error("SMTP_PASS is missing");
  }


  // Send email using Gmail SMTP

  try {
    const info = await transporter.sendMail({
      from: `"UniTrade" <${process.env.SMTP_FROM}>`,

      to: email,

      subject: subject,

      text: `
${heading}

Your UniTrade OTP is: ${otp}

This OTP is valid for 5 minutes.

If you did not request this, you can safely ignore this email.

UniTrade
Student Welfare & Resource Sharing Platform
      `.trim(),

      html: `
<!DOCTYPE html>

<html>

<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f5f5;
  font-family:Arial,sans-serif;
">

  <div style="
    max-width:600px;
    margin:40px auto;
    background:white;
    padding:30px;
    border-radius:12px;
  ">

    <h2 style="
      margin-bottom:10px;
      color:#222;
    ">
      ♻ UniTrade
    </h2>

    <h3 style="
      color:#333;
      margin-top:25px;
    ">
      ${heading}
    </h3>

    <p style="
      color:#555;
      font-size:16px;
    ">
      Your verification OTP is:
    </p>

    <div style="
      font-size:32px;
      font-weight:bold;
      letter-spacing:8px;
      padding:18px;
      background:#f4f4f4;
      text-align:center;
      border-radius:10px;
      margin:20px 0;
      color:#222;
    ">
      ${otp}
    </div>

    <p style="
      color:#555;
      font-size:15px;
    ">
      This OTP is valid for <b>5 minutes</b>.
    </p>

    <p style="
      color:#777;
      font-size:14px;
    ">
      If you did not request this, you can safely ignore this email.
    </p>

    <hr style="
      border:none;
      border-top:1px solid #ddd;
      margin:25px 0;
    ">

    <p style="
      color:#777;
      font-size:13px;
    ">
      UniTrade — Student Welfare & Resource Sharing Platform
    </p>

  </div>

</body>

</html>
      `,
    });


    console.log(
      "OTP email sent successfully:",
      info.messageId
    );

    return info;

  } catch (error) {

    console.error(
      "Gmail SMTP email error:",
      error
    );

    throw new Error(
      `Gmail email failed: ${error.message}`
    );
  }
}


// =========================================================
// HELPERS
// =========================================================

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}


function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
}


function generateOtp() {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
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


    const normalizedEmail =
      normalizeEmail(email);


    // Required fields

    if (
      !name ||
      !normalizedEmail ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }


    // Password validation

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }


    // Check existing verified account

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });


    if (
      existingUser &&
      existingUser.isVerified
    ) {
      return res.status(400).json({
        message:
          "An account with this email already exists",
      });
    }


    // Hash password

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // Generate OTP

    const otp = generateOtp();

    const otpHash = hashOtp(otp);


    // OTP valid for 5 minutes

    const otpExpiresAt =
      new Date(
        Date.now() + 5 * 60 * 1000
      );


    // Store pending signup

    await PendingSignup.findOneAndUpdate(
      {
        email: normalizedEmail,
      },

      {
        email: normalizedEmail,

        name: String(name).trim(),

        password: hashedPassword,

        college:
          String(college || "").trim(),

        course:
          String(course || "").trim(),

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
      message:
        "Registration OTP sent successfully",
    });

  } catch (error) {

    console.error(
      "Registration OTP error:",
      error
    );


    return res.status(500).json({
      message:
        "Could not send registration OTP",
    });
  }
}


// New registration OTP endpoint

router.post(
  "/request-register-otp",
  requestRegisterOtp
);


// Old register endpoint

router.post(
  "/register",
  requestRegisterOtp
);


// =========================================================
// REGISTER - VERIFY OTP
// =========================================================

router.post(
  "/verify-register-otp",
  async (req, res) => {

    try {

      const email =
        normalizeEmail(req.body.email);

      const otp =
        String(req.body.otp || "").trim();


      // Validate

      if (
        !email ||
        !/^\d{6}$/.test(otp)
      ) {
        return res.status(400).json({
          message:
            "Enter the valid 6-digit OTP",
        });
      }


      // Find pending signup

      const pending =
        await PendingSignup.findOne({
          email,
        });


      if (!pending) {
        return res.status(400).json({
          message:
            "Registration session expired. Please request a new OTP.",
        });
      }


      // Maximum attempts

      if (
        pending.otpAttempts >= 5
      ) {

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
        pending.otpExpiresAt.getTime() <
          Date.now()
      ) {

        await PendingSignup.deleteOne({
          _id: pending._id,
        });


        return res.status(400).json({
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }


      // Hash submitted OTP

      const submittedHash =
        hashOtp(otp);


      // Compare

      if (
        submittedHash !==
        pending.otpHash
      ) {

        pending.otpAttempts += 1;

        await pending.save();


        return res.status(401).json({
          message:
            "Invalid OTP",
        });
      }


      // Check if account appeared meanwhile

      const existingUser =
        await User.findOne({
          email,
        });


      let user;


      if (existingUser) {

        // Existing verified account

        if (existingUser.isVerified) {

          await PendingSignup.deleteOne({
            _id: pending._id,
          });


          return res.status(400).json({
            message:
              "An account with this email already exists",
          });
        }


        // Update old unverified account

        existingUser.name =
          pending.name;

        existingUser.password =
          pending.password;

        existingUser.college =
          pending.college;

        existingUser.course =
          pending.course;

        existingUser.isVerified =
          true;


        user =
          await existingUser.save();

      } else {

        // Create account

        user =
          await User.create({

            name: pending.name,

            email: pending.email,

            password: pending.password,

            college: pending.college,

            course: pending.course,

            isVerified: true,

          });
      }


      // Delete pending signup

      await PendingSignup.deleteOne({
        _id: pending._id,
      });


      // Create token

      const token =
        createToken(user);


      return res.status(201).json({

        message:
          "Account created and email verified successfully",

        token,

        user:
          publicUser(user),

      });

    } catch (error) {

      console.error(
        "Verify registration OTP error:",
        error
      );


      return res.status(500).json({
        message:
          "Could not verify registration OTP",
      });
    }
  }
);


// =========================================================
// LOGIN - REQUEST OTP
// =========================================================

router.post(
  "/request-login-otp",
  async (req, res) => {

    try {

      const email =
        normalizeEmail(req.body.email);

      const password =
        String(
          req.body.password || ""
        );


      // Validate

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Email and password are required",
        });
      }


      // Find user

      const user =
        await User.findOne({
          email,
        });


      if (!user) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }


      // Check password

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );


      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }


      // Generate OTP

      const otp =
        generateOtp();


      const otpHash =
        hashOtp(otp);


      // OTP valid for 5 minutes

      const otpExpiresAt =
        new Date(
          Date.now() + 5 * 60 * 1000
        );


      // Save OTP

      user.loginOtpHash =
        otpHash;

      user.loginOtpExpiresAt =
        otpExpiresAt;

      user.loginOtpAttempts =
        0;


      await user.save();


      // Send OTP

      await sendOtpEmail(
        email,
        otp,
        "login"
      );


      return res.json({
        message:
          "Login OTP sent successfully",
      });

    } catch (error) {

      console.error(
        "Login OTP error:",
        error
      );


      return res.status(500).json({
        message:
          "Could not send login OTP",
      });
    }
  }
);


// =========================================================
// LOGIN - VERIFY OTP
// =========================================================

router.post(
  "/verify-login-otp",
  async (req, res) => {

    try {

      const email =
        normalizeEmail(req.body.email);

      const otp =
        String(
          req.body.otp || ""
        ).trim();


      // Validate

      if (
        !email ||
        !/^\d{6}$/.test(otp)
      ) {
        return res.status(400).json({
          message:
            "Enter the valid 6-digit OTP",
        });
      }


      // Find user

      const user =
        await User.findOne({
          email,
        });


      if (!user) {
        return res.status(401).json({
          message:
            "Invalid login session",
        });
      }


      // Maximum attempts

      if (
        user.loginOtpAttempts >= 5
      ) {

        user.loginOtpHash = "";

        user.loginOtpExpiresAt = null;

        user.loginOtpAttempts = 0;


        await user.save();


        return res.status(429).json({
          message:
            "Too many incorrect OTP attempts. Please request a new OTP.",
        });
      }


      // Check expiry

      if (
        !user.loginOtpHash ||
        !user.loginOtpExpiresAt ||
        user.loginOtpExpiresAt.getTime() <
          Date.now()
      ) {
        return res.status(400).json({
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }


      // Hash submitted OTP

      const submittedHash =
        hashOtp(otp);


      // Compare

      if (
        submittedHash !==
        user.loginOtpHash
      ) {

        user.loginOtpAttempts += 1;

        await user.save();


        return res.status(401).json({
          message:
            "Invalid OTP",
        });
      }


      // Email verified

      user.isVerified = true;


      // Clear OTP

      user.loginOtpHash = "";

      user.loginOtpExpiresAt = null;

      user.loginOtpAttempts = 0;


      await user.save();


      // Create token

      const token =
        createToken(user);


      return res.json({

        message:
          "Login successful",

        token,

        user:
          publicUser(user),

      });

    } catch (error) {

      console.error(
        "Verify login OTP error:",
        error
      );


      return res.status(500).json({
        message:
          "Could not verify login OTP",
      });
    }
  }
);


// =========================================================
// NORMAL LOGIN
// =========================================================

router.post(
  "/login",
  async (req, res) => {

    try {

      const email =
        normalizeEmail(req.body.email);

      const password =
        String(
          req.body.password || ""
        );


      const user =
        await User.findOne({
          email,
        });


      if (!user) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }


      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );


      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }


      const token =
        createToken(user);


      return res.json({

        message:
          "Login successful",

        token,

        user:
          publicUser(user),

      });

    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      return res.status(500).json({
        message:
          "Login failed",
      });
    }
  }
);


// =========================================================
// CURRENT USER
// =========================================================

router.get(
  "/me",
  async (req, res) => {

    try {

      const header =
        req.headers.authorization || "";


      if (
        !header.startsWith(
          "Bearer "
        )
      ) {
        return res.status(401).json({
          message:
            "Authentication required",
        });
      }


      const token =
        header.slice(7);


      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET ||
            "unitrade_secret"
        );


      const user =
        await User.findById(
          decoded.userId
        );


      if (!user) {
        return res.status(401).json({
          message:
            "User not found",
        });
      }


      return res.json({
        user:
          publicUser(user),
      });

    } catch (error) {

      console.error(
        "Auth /me error:",
        error.message
      );


      return res.status(401).json({
        message:
          "Invalid or expired token",
      });
    }
  }
);


// =========================================================
// EXPORT
// =========================================================

module.exports = router;