const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

if( process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


//console.log(process.env.secret);

const express=require("express");
const path=require("path");
const app =express();
let port=8080;
const mongoose=require("mongoose");
const session = require("express-session");
const MongoStore=require("connect-mongo").default;
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const flash=require("connect-flash");
const ExpressError =require("./utils/ExpressError.js");
const { error } = require("console");
const passport =require("passport");
const LocalStrategy=require("passport-local").Strategy;
const User =require("./model/user.js");

const listingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.engine("ejs",ejsMate);
app.use(methodOverride('_method'))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

 


let db_url=process.env.ATLASDB_URL;



async function main(){
   await mongoose.connect(db_url);
}; 


main().then((r)=>console.log("connection done with databases"))
.catch((er)=>console.log(er));

const store= MongoStore.create({
    mongoUrl:db_url,
    crypto:{
         secret:process.env.SECRET,
  
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("error in mongo session store", err);
});

const sessionOption={
    store,
     secret:process.env.SECRET,
  
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,

    }
};




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







 
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    
  next();
})


app.use((req,res,next)=>{
    res.locals.mapalKey=process.env.MAP_KEY;
    next();
});

























app.get("/", (req, res) => {
    res.redirect("/listings");
});


//listing routess

app.use("/listings",listingsRouter);


//Reviews
//post 
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"Page not found !"))
});



app.use((err,req,res,next)=>{
    let {statusCode=404,message="something erro"}=err;
    console.log(err)
    res.status(statusCode).render("error.ejs",{err});
});


app.listen(port,()=>{
    console.log(`http://localhost:${port}/listings`);
});