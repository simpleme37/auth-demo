import express from "express";
import bcrypt from "bcrypt";
import db from "../db.js";
import { sendOTP } from "../../utils/sendOTP.js";

const router = express.Router();

// 註冊的路由
router.post("/", async (req, res) => {
  // 從 req.body 解構出這些值
  const { email, nickname, username, password } = req.body;

  // 萬一必需資料有缺漏
  if (!email || !username || !password) {
    return res.status(400).send("Email, username and password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users(email, nickname, username, password) VALUES(?, ?, ?, ?)";
    db.query(
      query,
      [email, nickname, username, hashedPassword],
      (err, result) => {
        if (err) {
          // 用於回調函數中，檢查並處理異步操作的錯誤
          return res.status(500).send("Server error");
        }
        res.status(201).send("User registered");
      }
    );
  } catch (error) {
    // 用於 try/catch 塊中，捕捉並處理異步函數中拋出的異常
    res.status(500).send("Error hashing password");
  }
});

// 發送驗證碼的路由
router.post("/send-verification-code", (req, res) => {
  // 接收請求內的值
  const { email } = req.body;
  // 如果沒收到值
  if (!email) {
    return res.status(400).send("Email is required");
  }

  // OTP 設定
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 分鐘過期
  // 如果 Email 已存在，更新 OTP
  const query =
    "INSERT INTO email_verification (email, otp, otp_expiry) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, otp_expiry = ?";

  // query 查詢
  db.query(query, [email, otp, otpExpiry, otp, otpExpiry], (err, result) => {
    if (err) {
      return res.status(500).send("Server error");
    }

    // 使用剛剛設定的 OTP 方法發送 OTP 到電子郵件
    sendOTP(email, otp);
    res.status(200).send("Verification code sent to your email");
  });
});

// 驗證 OTP 的路由
router.post("/check-verification-code", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).send("Email and OTP are required");
  }

  const query =
    "SELECT otp, otp_expiry FROM email_verification WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).send("Server error");
    }
    if (results.length === 0) {
      return res.status(400).send("Invalid email or OTP");
    }

    const record = results[0];
    console.log(record);
    // 如果 OPT 碼過期
    if (Date(record.otp_expiry) < Date.now()) {
      return res.status(400).send("OTP Expired");
    }
    // 如果 OTP 碼不符合
    if (record.otp !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    // 驗證成功
    res.status(200).send("OTP verified successfully");
  });
});

export default router;
