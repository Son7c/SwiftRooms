const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport=require("passport");
const { saveRedirectUrl } = require('../middleware');

const userController=require("../controllers/user.js")


router
    .route('/signup')

    //SignUp-Form
    .get(userController.renderSignupForm)

    //SignUp
    .post(wrapAsync(userController.signup))


router
    .route('/login')

    //Login-form
    .get(userController.renderLoginForm)

    //Login
    .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),userController.login)


//Logout
router.get("/logout",userController.logout)

module.exports=router;