var app = angular.module('clone', []);

app.controller('mainCtrl', ['$scope', function($scope){
  $scope.posts = [
    {title: 'post 1', upvotes: 5},
    {title: 'post 2', upvotes: 52},
    {title: 'post 3', upvotes: 3},
    {title: 'post 4', upvotes: 4},
  ];

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