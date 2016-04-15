var app = angular.module('clone', ['ui.router']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url:         '/home',
      templateUrl: '/home.html',
      controller:  'mainCtrl',
      resolve: {
        postPromise: ['posts', function(posts) {
          return posts.getAll();
        }]
      }
    });

  $stateProvider
    .state('posts', {
      url:         '/posts/{id}',
      templateUrl: '/posts.html',
      controller:  'postsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    });

  $urlRouterProvider.otherwise('home');
}]);

app.factory('posts', ['$http', function($http) {
  var object = {
    posts: []
  };

  object.getAll = function(){
    return $http.get('/posts').success(function(data) {
      angular.copy(data, object.posts);
    });
  };

  object.create = function(post) {
    return $http.post('/posts', post).success(function(data) {
      object.posts.push(data);
    });
  };

  object.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote')
      .success(function(data) {
        post.upvotes += 1;
      });
  };

  object.get = function(id) {
    return $http.get('/posts/' + id).then(function(res) {
      return res.data;
    });
  };

  object.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment);
  };

  return object;
}]);

app.controller('mainCtrl', ['$scope', 'posts', function($scope, posts) {
  $scope.posts = posts.posts;

  $scope.addPost = function(){
    if(!$scope.title || $scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      link:  $scope.link
    });
    $scope.title = '';
    $scope.link  = '';
  };

  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
  };
}]);

app.controller('postsCtrl', [
  '$scope',
  'posts',
  'post',
  function($scope, posts, post) {

    $scope.post = post;

    $scope.addComment = function(){
      if($scope.body === '') { return; }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user'
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };
}]);