const mongoose=require("mongoose");
const Review = require("./review.js");
const Schema=mongoose.Schema;

const listingSchema= new Schema(
    {
        title:{
            type:String,
            required:true,
        },
        description:String,
        image: {
    url: {
        type: String,
        default:
            "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60"
    },
    filename: {
        type: String,
        default: "default-image"
    }
},
        price:Number,
        location:String,
        country:String,
        reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review"
        }],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"

        },
       
        geometry:{
    type:{
        type:String,
        enum:["Point"],
        required:true
    },coordinates:{
    type:[Number],
    required:true
}// [lng, lat]
}

    }
);
listingSchema.post("findOneAndDelete",async(listing)=>{
   if(listing){
    await Review.deleteMany({_id :{$in:listing.reviews}});
}})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing