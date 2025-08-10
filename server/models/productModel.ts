import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  categories: string[];
  images?: string[];
  averageRating?: number;
  discount?: number;
  description?: string;
  stock: number;
  brand: string;
  reviews?: mongoose.Types.ObjectId[];
}

const validCategories = [
  "electronics",
  "clothings",
  "furnitures",
  "stationaries",
];

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, "Product name is required"],
    unique: true,
    maxLength: [40, "Product name should not exceed 40 characters"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    validate: {
      validator: function (this: IProduct) {
        return this.price > 0;
      },
      message: "Price should be greater than 0",
    },
  },
  categories: {
    required: true,
    type: [String],
  },
  images: {
    type: [String],
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
  },
  discount: {
    type: Number,
    validate: {
      validator: function (this: IProduct) {
        return this.discount === undefined || this.discount < this.price;
      },
      message: "Discount should be less than price",
    },
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    maxLength: [200, "Product description should not exceed 200 characters"],
  },
  stock: {
    type: Number,
    required: [true, "Product stock is required"],
    validate: {
      validator: function (this: IProduct) {
        return this.stock >= 0;
      },
      message: "Stock should be greater than or equals to 0",
    },
  },
  brand: {
    type: String,
    required: [true, "Product brand is required"],
  },
  reviews: {
    type: Schema.Types.ObjectId,
    ref: "Review",
  },
});

productSchema.pre("save", function (next) {
  const invalidCategories = this.categories.filter((category: string) => {
    return !validCategories.includes(category);
  });
  if (invalidCategories.length) {
    return next(new Error(`Invalid categories ${invalidCategories.join(" ")}`));
  } else {
    next();
  }
});

productSchema.post("save", function () {
  console.log("post save hook");
});

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;
