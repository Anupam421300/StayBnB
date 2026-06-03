const express= require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../schema.js")
const Review=require("../model/review.js");
const wrapAsync =require("../utils/wrapAsync.js");
const listings=require("../routes/listing.js")
const Listing=require("../model/listing.js");
const {validateReview, isLogin, isAuthor}=require("../middleware")

const reviewController=require("../controllers/review.js")

router.post("/",validateReview, isLogin ,wrapAsync(reviewController.postReview));
//delete review
router.delete("/:reviewId",isLogin,isAuthor, wrapAsync(reviewController.deleteReview))


module.exports=router;