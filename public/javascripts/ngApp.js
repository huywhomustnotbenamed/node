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
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
    });

  $stateProvider
    .state('posts', {
      url:         '/posts/{id}',
      templateUrl: '/posts.html',
      controller:  'postsCtrl'
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

  return object;
}]);

app.controller('mainCtrl', ['$scope', 'posts', function($scope, posts){
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

  $scope.incrementUpvotes = function(post){
    posts.upvote(post);
  };
}]);

app.controller('postsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  function($scope, $stateParams, posts){

    $scope.post = posts.posts[$stateParams.id];

    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body:   $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };
}]);