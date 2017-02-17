app.controller("UserController", ["$scope", "$location", "UserFactory", function ($scope, $location UserFactory) {
  $scope.user = {};
  $scope.create = function () {
    UserFactory.create($scope.user).then(function() {
      $location.url('/rooms')
    }, function() {

    });
  };
}]);
