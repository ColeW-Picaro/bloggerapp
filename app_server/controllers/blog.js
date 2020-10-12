var request = require('request');
var apiOptions = {
    server: "http://54.196.39.3:80"
};


var renderBlogList = function (req, res, responseBody) {
    res.render('bloglist', {
        title: 'Blog List',
        blogs: responseBody
    });
};

module.exports.getBlogList = function (req, res) {
    var path = '/api/blogs';
    var requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
        qs: {},
    };
    request(
        requestOptions,
        function (err, response, body) {
            renderBlogList(req, res, body);
        });
};

module.exports.blogAdd = function (req, res) {
    res.render('blogadd', { title: 'Blog Add' });
};

module.exports.doBlogAdd = function (req, res) {
    var path = '/api/blogs/';

    var postdata = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
    };

    var requestOptions = {
      url : apiOptions.server + path,
      method : "POST",
      json : postdata
    };
    request(
      requestOptions,
      function(err, response, body) {
         if (response.statusCode === 201) {
              res.redirect('/bloglist');
         } else {
              _showError(req, res, response.statusCode);
         }
      }
    );
};

var renderBlogEdit = function (req, res, responseBody) {
    res.render('blogedit', {
        title: 'Blog Edit',
        blog: responseBody
    });
};

module.exports.blogEdit = function (req, res) {
    var requestOptions, path;
    path = "/api/blogs/" + req.params.blogid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
                renderBlogEdit(req, res, body);
	    }
    );
};

module.exports.doBlogEdit = function (req, res) {
    var path = "/api/blogs/" + req.params.blogid;
    var postdata = {
        blogTitle : req.body.blogTitle,
        blogText : req.body.blogText,
    };
    var requestOptions = {
        url : apiOptions.server + path,
        method : "PUT",
        json : postdata
    };
    request(
	    requestOptions,
        function(err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/bloglist');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );


};

var renderBlogDelete = function (req, res, body) {
    res.render('blogdelete', {
        title: 'Blog Delete',
        blog: body
    });
};

module.exports.blogDelete = function(req, res) {
    var path = "/api/blogs/" + req.params.blogid;
    var requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
	requestOptions,
        function(err, response, body) {
            renderBlogDelete(req, res, body);
        }
    );
};


/* Book Delete Post */
module.exports.doBlogDelete = function(req, res){
    var id = req.params.blogid;
    var path = '/api/blogs/' + id;

    var requestOptions = {
	url : apiOptions.server + path,
        method : "DELETE",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 204) {
                res.redirect('/bloglist');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};


var _showError = function (req, res, status) {
    var title, content;
    if (status === 404) {
        title = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else {
        title = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }
    res.status(status);
    res.render('bloglist', {title: 'error', blogs: []});
};
