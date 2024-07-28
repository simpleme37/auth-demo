CREATE DATABASE IF NOT EXISTS signup_and_signin;

USE signup_and_signin;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
);

CREATE TABLE IF NOT EXISTS email_verification (
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6),
    otp_expiry DATETIME,
);