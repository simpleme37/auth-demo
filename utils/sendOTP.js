import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 配置郵件發送服務
const transport = nodemailer.createTransport({
  service: "gmail", // 使用的郵件服務
  auth: {
    user: process.env.EMAIL_USER, // 我的郵箱地址
    pass: process.env.EMAIL_PASS, // 我的App password
  },
});

// 匯出OTP功能
export const sendOTP = (email, otp) => {
  // Mail 內容
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is ${otp}`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
