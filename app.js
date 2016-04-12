var app = angular.module('clone', []);

app.factory('posts', [function(){
  var object = {
    posts: []
  };
  return object;
}]);

app.controller('mainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.posts = posts.posts

  $scope.addPost = function(){
    if(!$scope.title || $scope.title === '') { return; }
    $scope.posts.push({
      title:   $scope.title,
      link:    $scope.link,
      upvotes: 0
    });
    $scope.title = '';
    $scope.link  = '';
  };

  $scope.incrementUpvotes = function(post){
    post.upvotes += 1;
  };
}]);