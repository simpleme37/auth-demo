// 引入模塊
import mysql from "mysql";
import dotenv from "dotenv";

// 加載環境變量
dotenv.config();

// 創建資料庫連接，配置從env檔案讀取
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// 連接資料庫並處理錯誤
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("MySQL connected...");
});

export default db;
