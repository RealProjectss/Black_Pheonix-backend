require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

// Import middleware
const authMiddleware = require("./middleware/authMiddleware");

// Import configs
const swaggerDocs = require("./config/swaggerConfig");
const connectDB = require("./config/database");

// Import routes
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// ✅ Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8000",
];

// CORS
app.use(cors({origin: allowedOrigins, methods: ["POST", "PUT", "DELETE", "GET"]}))

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Swagger router
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authMiddleware, userRouter);
app.use("/api/v1/categories", categoryRouter);

const PORT = process.env.PORT || 8000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server: ${DOMAIN}`);
  console.log(`Swagger: ${DOMAIN}/swagger`);
  console.log(`=========================================================================`);
  console.log(`Localhost: http://localhost:8000`);
  console.log(`Swagger: http://localhost:8000/swagger`);
});
