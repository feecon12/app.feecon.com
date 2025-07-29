const express = require("express");
const productRouter = express.Router();

const {
  getProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  searchByParams,
} = require("../controllers/productController");

//routes for products
productRouter.get("/", searchByParams);
productRouter.get("/", getProducts);
productRouter.post("/", createProduct);
productRouter.get("/:id", getProductById);
productRouter.patch("/:id", updateProductById);
productRouter.delete("/:id", deleteProductById);

module.exports = productRouter;
