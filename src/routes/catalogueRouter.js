const router = require("express").Router();
const catalogueModel = require("../models/catalogueModel");
const crudCreator = require("../utils/crudCreator");
const authMiddleware = require("../middleware/authMiddleware");
const { slugify } = require("transliteration");

const catalogueController = crudCreator(catalogueModel, {
  populateFields: [{ path: "categories", populate: { path: "subCategories" } }],
});

/**
 * @swagger
 * /api/v1/catalogue:
 *   get:
 *     summary: Получить все категории
 *     tags: [Catalogue]
 *     responses:
 *       200:
 *         description: Список всех категорий
 *       500:
 *         description: Ошибка сервера
 *
 *   post:
 *     summary: Создать новую категорию
 *     tags: [Catalogue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categories
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "category_mongodb_id"
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
 * /api/v1/catalogue/{id}:
 *   get:
 *     summary: Получить одну категорию
 *     tags: [Catalogue]
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
 *     tags: [Catalogue]
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
 *     tags: [Catalogue]
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
 * /api/v1/catalogue/{id}/add-remove-category/{categoryId}:
 *   put:
 *     summary: Remove a category from a catalogue
 *     description: Removes a category from the catalogue by ID and updates the slug if needed.
 *     tags:
 *       - Catalogue
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the catalogue
 *       - name: categoryId
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

router.get("/", catalogueController.getAll);
router.get("/:id", catalogueController.getOne);

router.post("/", authMiddleware, async (req, res) => {
  try {
    let { name, slug, categories } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!slug || slug === "string") {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }
    if (categories?.length === 0) {
      return res.status(400).json({ message: "Categories field is required" });
    }
    const catalogue = (
      await catalogueModel.create({ name, slug, categories })
    ).populate([{ path: "categories", populate: { path: "subCategories" } }]);
    res.status(201).json(catalogue);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    const catalogue = await catalogueModel
      .findByIdAndUpdate(
        req.params.id,
        { name, slug },
        {
          new: true,
          runValidators: true,
        }
      )
      .populate({ path: "categories", populate: { path: "subCategories" } });
    res.status(201).json(catalogue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put(
  "/:id/add-remove-category/:categoryId",
  authMiddleware,
  async (req, res) => {
    try {
      const { id, categoryId } = req.params;

      const catalogue = await catalogueModel.findById(id);
      if (!catalogue) {
        return res.status(404).json({ error: "Catalogue not found" });
      }

      let updatedCatalogue;

      if (catalogue.categories.includes(categoryId)) {
        updatedCatalogue = await catalogueModel.findByIdAndUpdate(
          id,
          { $pull: { categories: categoryId } },
          { new: true, runValidators: true }
        );
      } else {
        updatedCatalogue = await catalogueModel.findByIdAndUpdate(
          id,
          { $addToSet: { categories: categoryId } },
          { new: true, runValidators: true }
        );
      }

      const populated = await updatedCatalogue.populate({
        path: "categories",
        populate: { path: "subCategories" },
      });

      res.status(201).json(populated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.delete("/:id", authMiddleware, catalogueController.remove);

module.exports = router;
