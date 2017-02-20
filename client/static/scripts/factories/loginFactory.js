console.log('factory working')
app.factory('loginFactory', ['$http', function($http) {

    var factory = {};

    factory.login = function(user) {
      console.log(user)
        return $http.post('/login',user)
    }
    return factory;
}]);
