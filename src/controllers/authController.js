require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};

exports.register = async (req, res) => {
  try {
    const {
      phoneNumber,
      firstName,
      lastName,
      address,
      gender,
      role = "admin",
      password,
    } = req.body;

    if (!phoneNumber || !firstName || !lastName || !address) {
      return res.status(400).json({
        success: false,
        message: "Обязательные поля: phoneNumber, firstName, lastName, address",
      });
    }

    if (role === "admin" && (!password || password.length === 0)) {
      return res
        .status(400)
        .json({ success: false, message: "Пароль обязателен для admin" });
    }

    if (role === "user" && password) {
      return res
        .status(400)
        .json({ success: false, message: "Пароль обязателен только для admin" });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Пользователь уже существует" });
    }

    const user = new User({
      phoneNumber,
      firstName,
      lastName,
      address,
      gender,
      role,
      password,
    });

    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      message: "Пользователь зарегистрирован",
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ошибка сервера",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Номер телефона обязателен" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Неверные учетные данные" });
    }

    if (user.role === "admin") {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Неверный пароль" });
      }
    }

    const token = generateToken(user);
    res.json({
      success: true,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ошибка сервера",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Пользователь не найден" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ошибка сервера",
      error: error.message,
    });
  }
};
