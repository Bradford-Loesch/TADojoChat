app.controller("UserController", ["$scope", "UserFactory", function ($scope, UserFactory) {
    $scope.users = [];
    $scope.user = {};

    $scope.setUsers = function() {
        UserFactory.index(function (data) {
            $scope.users = data;
        });
    }
    $scope.setUsers();

    function setUser(data) {
        $scope.user = data;
        $scope.newUser = {};
    }

    $scope.show = function() {
        UserFactory.show(setUser);
    }

    $scope.create = function (newUser)
    {
        UserFactory.create(newUser, setUsers);
    };

    $scope.update = function() {
        UserFactory.update($scope.newUser, setUsers);
        newUser = {};
    }

    $scope.delete = function(id) {
        UserFactory.delete(setUsers);
    }
}]);
