import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";
import dotenv from "dotenv";

dotenv.config(); // 加載 .env 文件
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// 登入的路由
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  // 資料缺漏
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  // SQL 查詢
  const query = "SELECT * FROM users WHERE username = ?";
  // 用用戶名把 results 撈出來
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Database query error:", err); // 打印錯誤信息
      return res.status(500).send("Server error");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    const user = results[0];
    const hashPassword = user.password;
    try {
      console.log("Comparing passwords...");
      const match = await bcrypt.compare(password, hashPassword);

      if (match) {
        console.log("Passwords match. Sign-in successful.");
        // jwt token
        const token = jwt.sign({ id: user.id }, SECRET_KEY, {
          expiresIn: "1h",
        });
        // 成功登入，返回 JSON 響應
        return res
          .status(200)
          .json({ message: "Sign-in successfully", token: token });
      } else {
        console.log("Passwords do not match. Sign-in failed.");
        return res.status(401).json({ message: "Sign-in failed" });
      }
    } catch (error) {
      console.error("Error during password comparison:", error); // 打印錯誤信息
      return res.status(500).json({ message: "Server error" });
    }
  });
});

export default router;
