CREATE DATABASE IF NOT EXISTS auth_demo
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

USE auth-demo;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS email_verification (
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6),
    otp_expiry DATETIME
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;