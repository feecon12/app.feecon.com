import { Request, Response } from "express";
import Product from "../models/productModel";
import Review from "../models/reviewModel";

interface CustomRequest extends Request {
  userId?: string;
}

const createReview = async (req: CustomRequest, res: Response) => {
  /**
   * 1. get the productId from the request params
   * 2. get the review and rating from the body
   * 3. get the userId from the req object
   * 4. update/add the rating and review to the product
   * 5. create a review object
   * 6. push the review id in the product reviews array
   */
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const { review, rating } = req.body;

    const reviewObj = await Review.create({
      review,
      rating,
      user: userId,
      product: productId,
    });

    // Update review on the product
    const productObj = await Product.findById(productId);
    if (!productObj) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      typeof productObj.averageRating === "number" &&
      Array.isArray(productObj.reviews)
    ) {
      const sum = productObj.averageRating * productObj.reviews.length;
      const finalAverageRating =
        (sum + rating) / (productObj.reviews.length + 1);
      productObj.averageRating = finalAverageRating;
    } else {
      productObj.averageRating = rating;
    }

    if (!Array.isArray(productObj.reviews)) {
      productObj.reviews = [];
    }
    productObj.reviews.push(reviewObj.id);
    await productObj.save();

    res.status(200).json({
      message: "Review successfully added!",
      data: reviewObj,
    });
  } catch (error: any) {
    console.log("Error in adding review", error);
    res.status(500).json({
      message: "Review cannot be added",
      error: error.message,
    });
  }
};

export { createReview };
