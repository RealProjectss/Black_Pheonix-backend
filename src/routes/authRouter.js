const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API для аутентификации пользователей
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - firstName
 *               - lastName
 *               - address
 *               - role
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               firstName:
 *                 type: string
 *                 example: "Иван"
 *               lastName:
 *                 type: string
 *                 example: "Иванов"
 *               address:
 *                 type: string
 *                 example: "ул. Ленина, д. 1"
 *               gender:
 *                 type: string
 *                 example: "male"
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Пользователь зарегистрирован"
 *       400:
 *         description: Ошибка валидации (например, пользователь уже существует)
 *       500:
 *         description: Ошибка сервера
 */
router.post("/register", register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1234567890"
 *                     firstName:
 *                       type: string
 *                       example: "Иван"
 *                     lastName:
 *                       type: string
 *                       example: "Иванов"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       401:
 *         description: Неверные учетные данные
 *       500:
 *         description: Ошибка сервера
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Получение профиля пользователя
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное получение профиля
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1234567890"
 *                     firstName:
 *                       type: string
 *                       example: "Иван"
 *                     lastName:
 *                       type: string
 *                       example: "Иванов"
 *                     address:
 *                       type: string
 *                       example: "ул. Ленина, д. 1"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       401:
 *         description: Неавторизованный доступ (токен отсутствует или недействителен)
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
