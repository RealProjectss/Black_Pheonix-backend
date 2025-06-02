const router = require("express").Router();
const {
  createProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct,
  getProductBySlug,
  getProductsByCategorySlug,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductDetail:
 *       type: object
 *       properties:
 *         size:
 *           type: string
 *         quantity:
 *           type: string
 *           default: "1"
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - slug
 *         - price
 *         - category
 *         - inStock
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         slug:
 *           type: string
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductDetail'
 *         price:
 *           type: number
 *         onSale:
 *           type: boolean
 *         priceOnSale:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *         color:
 *           type: string
 *         brand:
 *           type: string
 *         collection:
 *           type: string
 *         gender:
 *           type: string
 *         season:
 *           type: string
 *         inStock:
 *           type: number
 *         others:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product Not Found
 */

/**
 * @swagger
 * /api/v1/products/{slug}/by-slug:
 *   get:
 *     summary: Get a single product by SLUG
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product Not Found
 */

/**
 * @swagger
 * /api/v1/products/{slug}/by-category-slug:
 *   get:
 *     summary: Get a single product by category slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product Not Found
 */

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               slug:
 *                 type: string
 *               price:
 *                 type: number
 *               priceOnSale:
 *                 type: number
 *               onSale:
 *                 type: boolean
 *               inStock:
 *                 type: number
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Title is required
 */

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               slug:
 *                 type: string
 *               price:
 *                 type: number
 *               priceOnSale:
 *                 type: number
 *               onSale:
 *                 type: boolean
 *               inStock:
 *                 type: number
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product Not Found
 */

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product Not Found
 */

router.get("/", getProducts);
router.get("/:id", getOneProduct);
router.get("/:slug/by-slug", getProductBySlug);
router.get("/:slug/by-category-slug", getProductsByCategorySlug);
router.post(
  "/",
  [
    authMiddleware,
    uploadMiddleware("products", [{ name: "images", maxCount: 5 }]),
  ],
  authMiddleware,
  createProduct
);
router.put(
  "/:id",
  [
    authMiddleware,
    uploadMiddleware("products", [{ name: "images", maxCount: 5 }]),
  ],
  updateProduct
);
router.delete("/:id", deleteProduct);

module.exports = router;
