app.controller("UserController", ["$scope", "$location", "UserFactory", function ($scope, $location UserFactory) {
    // User variable
    $scope.user = {};

    // Function to call factory create
    $scope.create = function ()
    {
        UserFactory.create($scope.user).then(function() {
            $location.url('/rooms')
        }, function() {
            // errors
        });
    };
}]);
