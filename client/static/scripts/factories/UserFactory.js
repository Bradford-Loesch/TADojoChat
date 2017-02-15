
app.factory('userFactory', ['$http', '$routeParams', function ($http, $routeParams) {

    var factory = {};

    factory.index = function(callback) {
        $http.get('/users').then(function(response) {
            users = response.data;
            callback(users);
        }, function(err) {
            console.log(err);
        });
    };

    factory.subset = function(filter, callback) {
        $http.post('/user_subset', filter).then(function(response) {
            users = response.data;
            callback(users);
        }, function(err) {
            console.log(err);
        });
    };

    factory.show = function (callback) {
        $http.get(`/users/${$routeParams.id}`).then(function(response) {
            user = response.data;
            callback(user);
        }, function(err) {
            console.log(err);
        });
    }

    factory.create = function(newUser, callback) {
        $http.post('/register', user).then(function(response) {
            callback(response.data);
        }, function(err) {
            console.log(err);
        });
    };

    factory.update = function(editedUser, callback) {
        $http.put(`/users/${$routeParams.id}`, editedUser).then(function(response) {
            callback(response);
        }, function(err) {
            console.log(err);
        })
    }

    factory.delete = function(callback) {
        $http.delete(`/users/${$routeParams.id}`).then(function(response) {
            callback(response);
        }, function(err) {
            console.log(err);
        });
    }

    return factory;
}]);
