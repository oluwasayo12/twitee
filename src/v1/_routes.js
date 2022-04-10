"use strict";
const express = require("express");
const { check } = require("express-validator");
let router = express.Router();
const { auth } = require("./middlewares/auth");

router.use(async function(request, res, next) {
    try {
        next();
    } catch (e) {
        next(new Error(e.stack));
    }
});

let registerController = require('./_controller/register');
registerController = new registerController();

router
    .post('/register',[
        check("email", "Email is Required")
            .exists().isEmail().withMessage("A valid email address is required"),
        check("password", "Password is Required")
            .exists()
            .isLength({ min: 8 })
            .withMessage("Password should be at least 8 characters")
            .matches(/\d/)
            .withMessage("Password must contain a Number")],
        registerController.register
    );


let loginController = require('./_controller/login');
loginController = new loginController();

router
    .post('/login',[
        check("email", "Email is Required")
            .exists().isEmail().withMessage("A valid email address is required"),
        check("password", "Password is Required")
            .exists()],
        loginController.login
    );


let postsController = require('./_controller/posts');
postsController = new postsController();

router
    .get('/posts',
        [auth],
        postsController.getTwits
    );

router
    .post('/posts',
        [
            auth,
            check("twit", "Twit is Required")
            .exists()   
        ],
        postsController.postTwit
    );

router
    .delete('/posts/:id',
        [auth],
        postsController.deleteTwit
    );

let postCommentsController = require('./_controller/comments');
postCommentsController = new postCommentsController();
    
router
    .post('/post_comment/:id',
        [
            auth,
            check("comment", "Comment is Required")
            .exists()
        ],
        postCommentsController.postComments
    );

router
    .get('/posts/comments/:id',
        [auth],
        postCommentsController.getComments
    );

    

module.exports = router;