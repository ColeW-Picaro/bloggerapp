var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

const blogController = require('../controllers/blog');
const authController = require('../controllers/authentication');

router.get('/blogs', blogController.blogList);
router.get('/blogs/:blogid', blogController.blogRead);
router.post('/blogs/', auth, blogController.blogCreate);
router.put('/blogs/:blogid', auth, blogController.blogUpdate);
router.delete('/blogs/:blogid', auth, blogController.blogDelete);
router.post('/register', authController.register);
router.post('/login', authController.login);
module.exports = router;
