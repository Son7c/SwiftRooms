const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedIn,validateReview, isAuthor}=require("../middleware.js")

const reviewController=require("../controllers/reviews.js")

//Review post route
router.post("/reviews",isLoggedIn,validateReview,reviewController.createReview)

//Delete review route
router.delete("/reviews/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;