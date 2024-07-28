// 引入模塊
import express from "express"; // 用於創建和配置伺服器
import bodyParser from "body-parser"; // 用於解析請求體
import cors from "cors"; // 用於處理跨域請求
import registerRoute from "./routes/register.js"; // 引入註冊路由模塊
import loginRoute from "./routes/login.js"; // 引入登入路由模塊
import db from "./db.js"; // 引入資料庫連接模塊
import dotenv from "dotenv";

dotenv.config(); // 加載 .env 文件

const app = express(); // express 模塊的初始化語法

app.use(cors()); // 使用 cors 中間件
app.use(bodyParser.json()); // 使用 bodyParser 中間件解析 JSON 格式的請求體

// 配置路由 ( 將 registerRoute 模塊掛載到 /register 路徑 )
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use(express.static("image"));

// 測試資料庫連接是否成功( 用來執行 SQL 查詢 )
db.query("SELECT 1", (err, results) => {
  if (err) {
    console.error("Error executing query:", err);
  } else {
    console.log("Database connection successful:", results);
  }
});

// 會優先使用 env 檔的 PORT 設定，如果沒有設定就使用默認的 3000
const PORT = process.env.PORT || 3000;
// 這是用來啟動伺服器並讓它開始監聽指定端口上的請求。當伺服器啟動成功後，會打印一條消息到控制台。
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
