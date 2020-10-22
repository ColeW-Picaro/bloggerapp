var mongoose = require('mongoose');
var Blogger = mongoose.model('Blog');

// Helpers
var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var buildBlogList = function(req, res, results) {
  var blogs = [];
  results.forEach(function(obj) {
    blogs.push({
        blogTitle: obj.blogTitle,
        blogText: obj.blogText,
        createdOn: obj.createdOn,
        _id: obj._id,
    });
  });
  return blogs;
};

// GET /api/blogs
module.exports.blogList = function (req, res) {
    console.log('Getting blog list');
    Blogger.find()
           .exec(function(err, results) {
               if (!results) {
                   sendJSONresponse(res, 404, {
                       "message": 'no blogs found'
                   });
                   return;
               } else if (err) {
                   console.log(err);
                   sendJSONresponse(res, 404, err);
                   return;
               }
               console.log(results);
               sendJSONresponse(res, 200, buildBlogList(req, res, results));
           });
};

// GET /api/blogs/id
module.exports.blogRead = function (req, res) {
    if (req.params && req.params.blogid) {
    Blogger.findById(req.params.blogid)
        .exec(function(err, blog) {
            if (!blog) {
                sendJSONresponse(res, 404, {
                    "message": "blogid not found"
                });
                return;
            } else if (err) {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
            }
            console.log(blog);
            sendJSONresponse(res, 200, blog);
        });
    } else {
        console.log('no blogid provided');
        sendJSONresponse(res, 404, {
            "message": "No blogid in request"
        });
    }
};

// POST /api/blogs
module.exports.blogCreate = function (req, res) {
    console.log(req.body);
    Blogger.create({
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
    }, function(err, blog) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
        } else {
            console.log(blog);
            sendJSONresponse(res, 201, blog);
        }
    });
};

// PUT /api/blogs/id
module.exports.blogUpdate = function (req, res) {
    console.log("Updating a blog entry with id of " + req.params.blogid);
    Blogger.findOneAndUpdate(
        { _id: req.params.blogid },
        { $set: { "blogTitle": req.body.blogTitle, "blogText": req.body.blogText }},
        function(err, blog) {
            if (err) {
  	            sendJSONresponse(res, 400, err);
            } else {
	            sendJSONresponse(res, 201, blog);
            }
        }
    );
};

// DELETE /api/blogs/id
module.exports.blogDelete = function (req, res) {
    console.log("Deleting blog entry with id of " + req.params.blogid);
    console.log(req.body);
    Blogger.findByIdAndRemove(req.params.blogid)
           .exec (
               function(err, response) {
                   if (err) {
                       sendJSONresponse(res, 404, err);
                   } else {
                       sendJSONresponse(res, 204, null);
                   }
               }
           );
};
