
app.factory('UserFactory', ['$http', '$routeParams', function ($http, $routeParams) {

    var factory = {};

    // Retrieve a list of all users
    factory.index = function(callback) {
        $http.get('/users').then(function(response) {
            users = response.data;
            callback(users);
        }, function(err) {
            console.log(err);
        });
    };

    // Retrieve a subset of users
    factory.subset = function(filter, callback) {
        $http.post('/user_subset', filter).then(function(response) {
            users = response.data;
            callback(users);
        }, function(err) {
            console.log(err);
        });
    };

    // Retrieve data for one user
    factory.show = function (callback) {
        $http.get(`/users/${$routeParams.id}`).then(function(response) {
            user = response.data;
            callback(user);
        }, function(err) {
            console.log(err);
        });
    }

    // Create a new user
    factory.create = function(newUser, callback) {
        $http.post('/register', user).then(function(response) {
            callback(response.data);
        }, function(err) {
            console.log(err);
        });
    };

    // Update user information
    factory.update = function(editedUser, callback) {
        $http.put(`/users/${$routeParams.id}`, editedUser).then(function(response) {
            callback(response);
        }, function(err) {
            console.log(err);
        })
    }

    // Delete a user
    factory.delete = function(callback) {
        $http.delete(`/users/${$routeParams.id}`).then(function(response) {
            callback(response);
        }, function(err) {
            console.log(err);
        });
    }

    return factory;
}]);
