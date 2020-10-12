let express = require('express');
let router = express.Router();

const blogController = require('../controllers/blog');

router.get('/blogs', blogController.blogList);
router.get('/blogs/:blogid', blogController.blogRead);
router.post('/blogs/', blogController.blogCreate);
router.put('/blogs/:blogid', blogController.blogUpdate);
router.delete('/blogs/:blogid', blogController.blogDelete);
module.exports = router;
