app.controller("UserController", ["$scope", "UserFactory", function ($scope, UserFactory) {
    // User variable
    $scope.user = {};

    // Function to call factory create
    $scope.create = function (newUser)
    {
        UserFactory.create(newUser);
    };
}]);
