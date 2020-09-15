module.exports.renderBlogList = function (req, res) {
    res.render('blog', { title: 'Blog List'});
};

module.exports.renderBlogAdd = function (req, res) {
    res.render('blog', { title: 'Blog Add'});
};
