let express = require('express');
let router = express.Router();

const blogController = require('../controllers/blog');
const homeController = require('../controllers/home')

router.get('/', homeController.render);
router.get('/bloglist', blogController.renderBlogList)
router.get('/blogadd', blogController.renderBlogAdd)

module.exports = router;
