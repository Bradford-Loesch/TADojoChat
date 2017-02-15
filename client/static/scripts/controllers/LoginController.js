app.controller("LoginController", ["$scope", "UserFactory", function ($scope, UserFactory) {
        // Login call to factory
    $scope.login = function ()
    {
        UserFactory.login($scope.user, setUsers);
    };
}]);
