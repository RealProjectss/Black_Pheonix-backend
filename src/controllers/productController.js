const productModel = require("../models/productModel");
const { slugify } = require("transliteration");
const imageUrlCreator = require("../utils/imageUrlCreator");
const deleteFile = require("../utils/deleteFile");
const categoryModel = require("../models/categoryModel");

const populateFields = ["category", "others"];

const getProducts = async (req, res) => {
  try {
    const query = productModel.find();
    populateFields.forEach((field) => query.populate(field));

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    console.error("getProducts error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const query = productModel.findById(id);
    populateFields.forEach((field) => query.populate(field));

    const product = await query;
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const query = productModel.findOne({ slug });
    populateFields.forEach((field) => query.populate(field));

    const product = await query;
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug: slugify(slug) });
    const query = productModel.findOne({ category: category?._id });
    populateFields.forEach((field) => query.populate(field));

    const products = await query;
    if (!products) return res.status(404).json({ message: "Product Not Found" });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    let { title, slug } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    slug = slugify(slug && slug !== "string" ? slug : title);

    let images = [];
    if (req.files?.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      images = files.map((file) => imageUrlCreator(file.filename, "products"));
    }

    const newProduct = await productModel.create({
      ...req.body,
      slug,
      images,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("createProduct error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    if (req.body.title || req.body.slug) {
      req.body.slug = slugify(
        req.body.slug && req.body.slug !== "string"
          ? req.body.slug
          : req.body.title
      );
    }

    if (req.files?.images) {
      if (existingProduct.images?.length) {
        existingProduct.images.forEach((img) => deleteFile(img));
      }

      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      req.body.images = files.map((file) =>
        imageUrlCreator(file.filename, "products")
      );
    }

    const updatedProduct = await productModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .populate("parent")
      .populate("others");

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("updateProduct error:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    if (product.images?.length) {
      product.images.forEach((img) => deleteFile(img));
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("deleteProduct error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  getProductsByCategorySlug,
};
