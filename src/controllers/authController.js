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
      username,
      phoneNumber,
      firstName,
      lastName,
      address,
      gender,
      role = "admin",
      password,
    } = req.body;

    if (!phoneNumber || !firstName || !lastName || !address || !username) {
      return res.status(400).json({
        success: false,
        message:
          "Обязательные поля: phoneNumber, firstName, lastName, address, username",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ phoneNumber }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Пользователь уже существует" });
    }

    const user = new User({
      username,
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
        username: user.username,
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
    const { username, password } = req.body;

    if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "Юзернейм обязателен" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Неверные учетные данные" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Неверный пароль" });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
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
