var app = angular.module("bloggerApp", ['ngRoute', 'ui.router']);

// Routing Providers
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/blog-list', {
            templateUrl: 'pages/bloglist.html',
            controller: 'ListController',
            controllerAs: 'vm'
        })
        .when('/blog-add', {
            templateUrl: 'pages/blogadd.html',
            controller: 'AddController',
            controllerAs: 'vm'
        })
        .when('/blog/:id', {
            templateUrl: 'pages/blog.html',
            controller: 'BlogController',
            controllerAs: 'vm'
        })
        .when('/blog-edit/:id', {
            templateUrl: 'pages/blogedit.html',
            controller: 'EditController',
            controllerAs: 'vm'
        })
        .when('/blog-delete/:id', {
            templateUrl: 'pages/blogdelete.html',
            controller: 'DeleteController',
            controllerAs: 'vm'
        })
        .when('/register', {
            templateUrl: '/js/auth/register.html',
            controller: 'RegisterController',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl: '/js/auth/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.config(function($stateProvider) {
    $stateProvider
        .state('blog-list', {
          url: '/blog-list',
          templateUrl: 'pages/blog-list.html',
          controller : 'ListController'
        });
});


// REST API functions
function getAllBlogs($http) {
    return $http.get('/api/blogs');
};

function getBlogById($http, id) {
    return $http.get('/api/blogs/' + id);
};

function updateBlogById($http, id, data, auth) {
    return $http.put('/api/blogs/' + id, data, { headers: { Authorization: 'Bearer '+ auth.getToken() }});
};

function addBlog($http, data, auth) {
    return $http.post('/api/blogs/', data, { headers: { Authorization: 'Bearer '+ auth.getToken() }});
}

function deleteBlog($http, id, auth) {
    return $http.delete('/api/blogs/' + id, { headers: { Authorization: 'Bearer '+ auth.getToken() },
                                              });
}

function addCommentToBlog($http, id, data) {
    return $http.put('/api/blogs/' + id + '/commentadd', data);
}

app.controller('HomeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "Cole's Blog"
    };
    vm.message = "Welcome to my blog page!";
});

app.controller('ListController', function ListController($http, authentication, $interval, $scope) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog List"
    };
    res = getAllBlogs($http)
        .then(
            function(data) {
                vm.blogs = data.data;
            },
            function(error) {
                console.log(error);
            });
    vm.currentUser = function () {
        return authentication.currentUser();
    };
    vm.isLoggedIn = function() {
        return authentication.isLoggedIn();
    };
    vm.isCreatedBy = function(email) {
        console.log(email);
        return authentication.currentUser().email == email;
    };
    // Refresh on interval
    $scope.callAtInterval = function() {
        console.log("refreshing data");
        getAllBlogs($http)
            .then(
                function(data) {
                    vm.blogs = data.data;
                },
                function (e) {
                    console.log(e);
                    $state.go('blog-list');
                });
    };
    $interval(function(){$scope.callAtInterval();}, 3000, 0, true);
});

app.controller('BlogController', function BlogController($http, $routeParams, $interval, $scope) {
    var vm = this;
    var blog = {};
    vm.id = $routeParams.id;

    getBlogById($http, vm.id)
      .then(
          function(data) {
              vm.blog = data.data;
          },
          function (e) {
              console.log(e);
              $state.go('blog-list');
          });
    vm.submit = function() {
        var data = {
            comment: userForm.commentText.value
        };
        addCommentToBlog($http, vm.id, data)
            .then(
                function(data) {
                    console.log('added');

                },
                function(error) {
                    console.log(error);
                }
            );
    };

    // Refresh on interval
    $scope.callAtInterval = function() {
        console.log("refreshing data");
        getBlogById($http, vm.id)
            .then(
                function(data) {
                    vm.blog = data.data;
                },
                function (e) {
                    console.log(e);
                    $state.go('blog-list');
                });
    };
    $interval(function(){$scope.callAtInterval();}, 3000, 0, true);
})

app.controller('AddController', function AddController($http, $routeParams, $state, authentication) {
    var vm = this;
    vm.blog = {};
    vm.pageHeader = {
        title: 'Blog Add'
    };

    vm.submit = function() {
        var data = vm.blog;
        data.blogTitle = userForm.blogTitle.value;
        data.blogText =  userForm.blogText.value;
        data.authorEmail = authentication.currentUser().email;
        data.authorName = authentication.currentUser().name;
        addBlog($http, data, authentication)
            .then(
                function(data) {
                    console.log('added');
                    $state.go('blog-list');
                },
                function(error) {
                    console.log('error');
                    $state.go('blog-list');
                }
            );
    };
});

app.controller('EditController', function EditController($http, $routeParams, $state, authentication) {
    var vm = this;
    vm.blog = {};
    vm.id = $routeParams.id;
    vm.pageHeader = {
        title: 'Blog Edit'
    };

    getBlogById($http, vm.id)
      .then(
          function(data) {
              vm.blog = data.data;
          },
          function (e) {
              console.log(e);
              $state.go('blog-list');
          });

    vm.submit = function() {
        var data = vm.blog;
        data.blogTitle = userForm.blogTitle.value;
        data.blogText = userForm.blogText.value;

        updateBlogById($http, vm.id, data, authentication)
            .then(
                function(data) {
                    console.log('edited');
                    $state.go('blog-list');
                },
                function (e) {
                    console.log(e);
                    $state.go('blog-list');
                });
    };
});

app.controller('DeleteController', function DeleteController($http, $routeParams, $state, authentication) {
    var vm = this;
    vm.blog = {};
    vm.id = $routeParams.id;
    vm.pageHeader = {
        title: 'Blog Delete'
    };

    getBlogById($http, vm.id)
        .then(
            function(data) {
                vm.blog = data.data;
            },
            function (e) {
                console.log(e);
                $state.go('blog-list');
            });

    vm.submit = function() {
        deleteBlog($http, vm.id, authentication)
            .then(
                function(data) {
                    console.log('deleted');
                    $state.go('blog-list');
                },
                function (e) {
                    console.log(e);
                    $state.go('blog-list');
                });
    };

    vm.cancel = function() {
        $state.go('blog-list');
    };
});
