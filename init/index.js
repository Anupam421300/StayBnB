const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../model/listing.js");





let mongo_url="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    mongoose.connect(mongo_url);
};

main().then((r)=>console.log("connection done with databases"))
.catch((er)=>console.log(er));


const initDB= async()=>{
    await Listing.deleteMany({});
    
    initData.data = initData.data.map((obj)=>({...obj,owner:"6a1d1dc04abf086b27ebafda"}))
    await Listing.insertMany(initData.data);
}

initDB();
