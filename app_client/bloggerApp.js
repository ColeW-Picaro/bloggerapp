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

function updateBlogById($http, id, data) {
    return $http.put('/api/blogs/' + id, data);
};

function addBlog($http, data) {
    return $http.post('/api/blogs/', data);
}

function deleteBlog($http, id) {
    return $http.delete('/api/blogs/' + id);
}

app.controller('HomeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "Cole's Blog"
    };
    vm.message = "Welcome to my blog page!";
});

app.controller('ListController', function ListController($http) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog List"
    };
    res = getAllBlogs($http)
        .then(
            function(data) {
                vm.blogs = data.data;
                console.log(vm.blogs);
                console.log(data);
            },
            function(error) {
                console.log(error);
            });
});

app.controller('AddController', function AddController($http, $routeParams, $state) {
    var vm = this;
    vm.blog = {};
    vm.pageHeader = {
        title: 'Blog Add'
    };

    vm.submit = function() {
        var data = vm.blog;
        data.blogTitle = userForm.blogTitle.value;
        data.blogText =  userForm.blogText.value;

        addBlog($http, data)
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

app.controller('EditController', function EditController($http, $routeParams, $state) {
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

        updateBlogById($http, vm.id, data)
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

app.controller('DeleteController', function DeleteController($http, $routeParams, $state) {
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
        deleteBlog($http, vm.id)
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
