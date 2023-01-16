const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { connection } = require("../connection");
const jwt = require("jsonwebtoken");

//Login user route
router.post("/login", async (req, res) => {
  const { db } = await connection();
  const { email, password } = req.body;

  //Checking empty values
  if (!email || !password) {
    res.status(400).json({ message: "Email or Password is missing" });
  }
  //Checking if user is registered or not
  const user = await db.collection("user").findOne({ email: email });
  if (!user) {
    res.json({ message: "User does not exist" });
  } else {
    //Comparing passwords
    const passwordIsTrue = await bcrypt.compare(password, user?.password);
    //Generating token
    const secretkey = "someprivatekey";
    const token = jwt.sign({ _id: user?._id, name: user?.name }, secretkey, {
      expiresIn: 20000,
    });
    if (passwordIsTrue) {
      return res.status(200).json({
        message: "User logged successfully",
        token,
        email,
        isSuccess: true,
      });
    } else {
      return res.status(200).json({
        message: "Password is wrong",
        isSuccess: false,
      });
    }
  }
});

//Signup user route
router.post("/signup", async (req, res) => {
  const { db } = await connection();
  const { name, email, password } = req.body;
  //Checking for empty values
  if (!name || !email || !password) {
    return res.json({ message: "Please fill all required fields" });
  } else {
    //Checking if user exists
    const emailExists = await db.collection("user").findOne({ email: email });
    if (emailExists) {
      return res.json({ message: "User already exists", isSuccess: false });
    } else {
      //hashing password
      const hashedPassword = await bcrypt.hash(password, 10);
      //Insert user
      await db.collection("user").insertOne({
        name,
        email,
        password: hashedPassword,
      });
      return res.json({
        message: "User registered successfully",
        isSuccess: true,
      });
    }
  }
});

module.exports = router;
