import Product, { IProduct } from "../models/productModel";
import {
  createFactory,
  deleteFactoryById,
  getFactory,
  getFactoryById,
  searchFactoryByParams,
  updateFactoryById,
} from "../utils/crudFactory";

const getProducts = getFactory<IProduct>(Product);
const createProduct = createFactory<IProduct>(Product);
const getProductById = getFactoryById<IProduct>(Product);
const updateProductById = updateFactoryById<IProduct>(Product);
const deleteProductById = deleteFactoryById<IProduct>(Product);
const searchByParams = searchFactoryByParams<IProduct>(Product);

export {
  getProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  searchByParams,
};
