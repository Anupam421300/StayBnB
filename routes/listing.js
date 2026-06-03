const express= require("express");
const router=express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError =require("../utils/ExpressError.js");
const Listing=require("../model/listing.js");
const {isLogin,isOwner}=require("../middleware.js")
const {validateListing}=require("../middleware.js");
const { populate } = require("../model/review.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage});



router.route("/")
.get(wrapAsync(listingController.index))
.post( isLogin, upload.single('listings[image]'),validateListing,wrapAsync(listingController.newListings));



router.get("/new",isLogin,(req,res)=>{
    res.render("new.ejs");
})

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLogin,isOwner,upload.single('listings[image]'),validateListing,wrapAsync(listingController.postEdit))
.delete(isLogin,isOwner,wrapAsync (listingController.destroyList));



//add new route


//edit route
router.get("/:id/edit",isLogin, wrapAsync(listingController.renderEdit));



module.exports=router;
