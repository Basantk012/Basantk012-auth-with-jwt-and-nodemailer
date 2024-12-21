# Authentication with JWT and Nodemailer

This project demonstrates how to implement authentication in a Node.js application using **JSON Web Tokens (JWT)** and **Nodemailer** for email functionalities. It includes user registration, login, token generation, and sending emails with Nodemailer.

## Features
- User registration with email verification
- JWT-based user authentication
- Secure password storage using bcrypt
- Email sending functionality via Nodemailer
- RESTful API for user authentication

## Technologies Used
- **Node.js**: Backend runtime environment
- **Express.js**: Web framework for Node.js
- **JWT (JSON Web Tokens)**: Secure authentication and token management
- **Nodemailer**: Email service for sending verification emails
- **bcryptjs**: Password hashing
- **dotenv**: Managing environment variables
- **MongoDB**: Database for storing user data
- **Angular**: Frontend framework for building dynamic, single-page applications
- **Bootstrap**: Frontend CSS framework for responsive design and UI components

## Setup and Installation

## Prerequisites
- **Node.js** (version 18 LTS)
- **Angular 14** (for frontend development)
- **MongoDB** instance (can be local or hosted on a service like MongoDB Atlas)
- **A working email provider** (Gmail etc.) for sending emails

### Steps to Set Up the Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Basantk012/auth-with-jwt-and-nodemailer.git

2. **Navigate into the project folder:**
   ```bash
   cd auth-with-jwt-and-nodemailer

3. **Install the required dependencies:**
   ```bash
   npm install

4. **Create a .env file in the server directory and add the following environment variables:**
   ```bash
   DBURL = ""
   secretKey ="secret key for jwt"
   authmail = "email of sender"
   authpass = "generate Application password"

## Step to Set Up the genrate Application password
1.  Go to your Google account at https://myaccount.google.com/
2.  Go to Security
3.  Choose 2-Step Verification - here you have to verify yourself, in my case it was with phone number and a confirmation code send as text message. After that you will be able to enabled 2-Step Verification
4.  Visit https://myaccount.google.com/apppasswords to create your app.
5.  Put a name e.g. nodemailer to your app and create it.
6.  A modal dialog will appear with the password. Get that password and use it in your code
