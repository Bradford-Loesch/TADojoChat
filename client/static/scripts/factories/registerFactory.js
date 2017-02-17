
app.factory('registerFactory', ['$http', function($http) {

    var factory = {};

    factory.register = function(user) {
        return $http.post('/register', user)
    }
    return factory;
}]);
