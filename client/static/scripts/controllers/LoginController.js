
app.controller("LoginController", ["$scope", "UserFactory", function ($scope, UserFactory) {
    // Declare user variable
    $scope.user = {};
    // Login call to factory
    $scope.login = function ()
    {
        UserFactory.login($scope.user).then(function() {
            $location.url('/rooms')
        }, function() {
            // errors
        });
    };
}]);
