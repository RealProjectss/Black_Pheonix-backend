const router = require("express").Router();
const categoryModel = require("../models/categoryModel");
const crudCreator = require("../utils/crudCreator");
const authMiddleware = require("../middleware/authMiddleware");
const { slugify } = require("transliteration");

const categoryController = crudCreator(categoryModel, {
  populateFields: "subCategories",
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
 *               - subCategories
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               subCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "sub_category_mongodb_id"
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
 * /api/v1/categories/{id}/add-remove-sub-category/{subCategoryId}:
 *   put:
 *     summary: Remove a sub-category from a category
 *     description: Removes a sub-category from the category by ID and updates the slug if needed.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the catalogue
 *       - name: subCategoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to remove
 *     responses:
 *       201:
 *         description: Category removed successfully and catalogue updated
 *       400:
 *         description: Bad request (e.g. invalid ID or other errors)
 */

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { name, slug, subCategories } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!slug || slug === "string") {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }
    if (subCategories?.length === 0) {
      return res
        .status(400)
        .json({ message: "subCategories field is required" });
    }
    const category = (
      await categoryModel.create({ name, slug, subCategories })
    ).populate("subCategories");
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let { name, slug } = req.body;
    if (!slug || slug === "string") {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }
    const category = await categoryModel
      .findByIdAndUpdate(
        req.params.id,
        { name, slug },
        {
          new: true,
          runValidators: true,
        }
      )
      .populate("subCategories");
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.put(
  "/:id/add-remove-sub-category/:subCategoryId",
  authMiddleware,
  async (req, res) => {
    try {
      const { id, subCategoryId } = req.params;

      const category = await categoryModel.findById(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      let updatedCatalogue;

      if (category.subCategories.includes(subCategoryId)) {
        updatedCatalogue = await categoryModel.findByIdAndUpdate(
          id,
          { $pull: { subCategories: subCategoryId } },
          { new: true, runValidators: true }
        );
      } else {
        updatedCatalogue = await categoryModel.findByIdAndUpdate(
          id,
          { $addToSet: { subCategories: subCategoryId } },
          { new: true, runValidators: true }
        );
      }

      const populated = await updatedCatalogue.populate("subCategories");

      res.status(201).json(populated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);
router.delete("/:id", authMiddleware, categoryController.remove);

module.exports = router;
