import express from "express";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  searchByParams,
  updateProductById,
} from "../controllers/productController";

const productRouter = express.Router();
//routes for products
productRouter.get("/", searchByParams);
productRouter.get("/", getProducts);
productRouter.post("/", createProduct);
productRouter.get("/:id", getProductById);
productRouter.patch("/:id", updateProductById);
productRouter.delete("/:id", deleteProductById);

export default productRouter;
