const router = require("express").Router();
const categoryModel = require("../models/categoryModel");
const crudCreator = require("../utils/crudCreator");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCategoryPath,
  createCategory,
  updateCategory,
} = require("../controllers/categoryController");

const categoryController = crudCreator(categoryModel, {
  populateFields: "parent",
});

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Получить все категории
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список всех категорий
 *       500:
 *         description: Ошибка сервера
 *
 *   post:
 *     summary: Создать новую категорию
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               parent:
 *                 type: string
 *                 example: "category_mongodb_id"
 *     responses:
 *       201:
 *         description: Категория успешно создана
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Получить одну категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID категории
 *     responses:
 *       200:
 *         description: Данные о категории
 *       404:
 *         description: Категория не найдена
 *       500:
 *         description: Ошибка сервера
 *
 *   put:
 *     summary: Обновить категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID категории
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               parent:
 *                 type: string
 *     responses:
 *       200:
 *         description: Категория успешно обновлена
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Категория не найдена
 *       500:
 *         description: Ошибка сервера
 *
 *   delete:
 *     summary: Удалить категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID категории
 *     responses:
 *       200:
 *         description: Категория успешно удалена
 *       404:
 *         description: Категория не найдена
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /api/v1/categories/{id}/path:
 *   get:
 *     summary: Получить путь до категории по ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID категории
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успешное получение пути категории
 *       500:
 *         description: Ошибка при получении пути
 */
router.get("/:id/path", getCategoryPath);
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, categoryController.remove);

module.exports = router;
