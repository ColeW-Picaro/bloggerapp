let express = require('express');
let router = express.Router();

const blogController = require('../controllers/blog');
const homeController = require('../controllers/home');

router.get('/', homeController.render);
router.get('/bloglist', blogController.getBlogList);
router.get('/blogadd', blogController.blogAdd);
router.post('/blogadd', blogController.doBlogAdd);
router.get('/blogedit/:blogid', blogController.blogEdit);
router.post('/blogedit/:blogid', blogController.doBlogEdit);
router.get('/blogdelete/:blogid', blogController.blogDelete);
router.post('/blogdelete/:blogid', blogController.doBlogDelete);

module.exports = router;
