const express = require("express");
const reviewRouter = express.Router();
const { Product, Review } = require("../models");
const { protectRoute } = require("../controllers/authController");

reviewRouter.post("/:productId", protectRoute, async (req, res) => {
  /**
   * 1. get the productId from the request params
   * 2. get the review and ratinf from the body
   * 3. get the userId from the req object
   * 4. update/ add the rating and review to the product
   * 5. create a review object
   * 6. push the review id in the product reviews array
   */

  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const { review, rating } = req.body;

    const reviewObj = await Review.create({
      review: review,
      rating: rating,
      user: userId,
      product: productId,
    });
    /**update review on the product */
    const productObj = await Product.findById(productId);
    const averageRating = productObj.averageRating;
    if (averageRating) {
      const sum = averageRating * productObj.reviews.length;
      const finalAverageRating =
        (sum + rating) / (productObj.reviews.length + 1);
      productObj.averageRating = finalAverageRating;
    } else {
      productObj.averageRating = rating;
    }
    productObj.reviews.push(reviewObj._id);
    await productObj.save();
    res.status(200).json({
      message: "Review successfully added!",
      data: reviewObj,
    });
  } catch (error) {
    console.log("Error in adding review", error);
    res.status(500).json({
      message: "Review cannot be added",
      error: error.message,
    });
  }
});

reviewRouter.get("/", async (req, res) => {});

module.exports = reviewRouter;
