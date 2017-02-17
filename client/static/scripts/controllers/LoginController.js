app.controller("LoginController", ["$scope", function ($scope) {
    // Declare user variable
    $scope.user = {};
    console.log('controller being loaded')

    // Login call to factory
    $scope.login = function ()
    {
      console.log('working')
        UserFactory.login($scope.user).then(function() {
            $location.url('/rooms')
        }, function() {
            // errors
        });
    };
}]);
