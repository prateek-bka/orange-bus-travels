const usersModel = require("../models/usersModel");

const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// Register New User

router.post("/register", async (req, res) => {
  try {
    const existingUser = await usersModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.send({
        message: "User already exists",
        success: false,
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const newUser = new usersModel(req.body);
    await newUser.save();
    res.send({
      message: "User created successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const userExists = await usersModel.findOne({ email: req.body.email });
    if (!userExists) {
      return res.send({
        message: "User does not exists",
        success: false,
        data: null,
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );

    if (!passwordMatch) {
      return res.send({
        message: "Incorrect Password",
        success: false,
        data: null,
      });
    }

    const token = jwt.sign(
      {
        // email: userExists.email,
        // id: userExists._id,
        userId: userExists._id,
      },
      process.env.jwt_secret,
      { expiresIn: "1d" }
    );

    res.send({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// get-user-by-id

router.post("/get-user-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await usersModel.findById(req.body.userId);
    res.send({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

module.exports = router;
