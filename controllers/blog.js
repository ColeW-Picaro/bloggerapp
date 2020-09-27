module.exports.renderBlogList = function (req, res) {
    res.render('bloglist',
               {title: 'Blog List',
                blogs: [
                    {
                        blogTitle: 'How do I rotate text?',
                        blogText: 'How do I rotate text in MSPaint?',
                        createdOn: '09-24-2020'
                    },
                    {
                        blogTitle: 'How do I write a blog?',
                        blogText: 'How do I write a blog here?',
                        createdOn: '09-24-2020'
                    },
                    {
                        blogTitle: 'I miss blogging',
                        blogText: 'What happened to the days where people blogged?',
                        createdOn: '09-24-2020'
                    },
                ]
               });
};

module.exports.renderBlogAdd = function (req, res) {
    res.render('blog', { title: 'Blog Add' });
};

module.exports.renderBlogEdit = function (req, res) {
    res.render('blogedit', { title: 'Blog Edit' });
}

module.exports.renderBlogDelete = function (req, res) {
    res.render('blogdelete', { title: 'Blog Delete' });
}
