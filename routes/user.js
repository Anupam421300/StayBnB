const express= require("express");
const router=express.Router();
const User=require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport =require("passport")
const {saveRedirectUrl}=require("../middleware.js");

const userController=require("../controllers/user.js")



router.route("/signup")
.get(userController.getSignupform)
.post(wrapAsync(userController.signup));


//login get
router.route("/login")
.get(userController.getloginform)
.post(saveRedirectUrl,passport.authenticate("local",
    {failureRedirect:"/login",
    failureFlash:true
    }) ,userController.login
   )



router.get("/logout",userController.logout)


module.exports=router;