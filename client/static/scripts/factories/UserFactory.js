
app.factory('UserFactory', ['$http', '$routeParams', function ($http, $routeParams) {

    var factory = {};

    // Retrieve a list of all users
    factory.index = function(callback) {
        return $http.get('/profiles')
    };

    // Retrieve a subset of users
    // Possibly refactor to get with filter information in url
    factory.subset = function(filter) {
        return $http.post('/profiles/subset', filter)
    };

    // Retrieve data for one user
    factory.show = function (callback) {
        return $http.get(`/profiles/${$routeParams.id}`)
    }

    // Create a new user
    factory.create = function(newUser) {
        return $http.post('/profiles', newUser)
    };

    // Update user information
    factory.update = function(editedUser) {
        $http.patch(`/profiles/${$routeParams.id}`, editedUser)
    }

    // Delete a user
    factory.delete = function(callback) {
        return $http.delete(`/profiles/${$routeParams.id}`)
    }

    return factory;
}]);
