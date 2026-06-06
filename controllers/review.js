const Review=require("../model/review.js");
const Listing=require("../model/listing.js");



module.exports.postReview=async(req,res)=>{
    let{id}=req.params
    let listing = await Listing.findById(id);
    let newReview=new Review(
        req.body.review
    );
   
    if(!newReview.rating){
        newReview.rating=1;
    };
    console.log(newReview);
    newReview.author =req.user._id;
   
    listing.reviews.push(newReview);
    await newReview.save();
     await listing.save();
      req.flash("success","Review successfully created..")

    res.redirect(`/listings/${id}`);

};

module.exports.deleteReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review successfully deleted..")

    res.redirect(`/listings/${id}`)

};

