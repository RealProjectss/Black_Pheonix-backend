const { slugify } = require("transliteration");
const categoryModel = require("../models/categoryModel");

const getCategoryPath = async (req, res) => {
  try {
    const path = [];
    let current = await categoryModel.findById(req.params.id);

    while (current) {
      path.unshift(current);
      current = current.parent
        ? await categoryModel.findById(current.parent)
        : null;
    }

    res.json({ path });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при получении пути" });
  }
};

const createCategory = async (req, res) => {
  try {
    let { name, slug, parent } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!slug || slug === "string") {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }
    const category = await categoryModel.create({ name, slug, parent });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    let { name, slug, parent } = req.body;
    if (!slug || slug === "string") {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }
    const category = await categoryModel
      .findByIdAndUpdate(
        req.params.id,
        { name, slug, parent },
        {
          new: true,
          runValidators: true,
        }
      )
      .populate("parent");
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCategoryPath,
  createCategory,
  updateCategory,
};
