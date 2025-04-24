const router = require("express").Router();
const subCategoryModel = require("../models/subCategoryModel");
const crudCreator = require("../utils/crudCreator");
const authMiddleware = require("../middleware/authMiddleware");

const subCategoryController = crudCreator(subCategoryModel);

/**
 * @swagger
 * /api/v1/sub-categories:
 *   get:
 *     summary: Получить все категории
 *     tags: [Sub-Categories]
 *     responses:
 *       200:
 *         description: Список всех категорий
 *       500:
 *         description: Ошибка сервера
 *
 *   post:
 *     summary: Создать новую категорию
 *     tags: [Sub-Categories]
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
 * /api/v1/sub-categories/{id}:
 *   get:
 *     summary: Получить одну категорию
 *     tags: [Sub-Categories]
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
 *     tags: [Sub-Categories]
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
 *     tags: [Sub-Categories]
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

router.get("/", subCategoryController.getAll);
router.get("/:id", subCategoryController.getOne);
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!slug || slug === "string") {
      slug = name.replaceAll(" ", "-");
    }
    const subCategory = await subCategoryModel.create({ name, slug });
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const subCategory = await subCategoryModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", authMiddleware, subCategoryController.remove);

module.exports = router;
