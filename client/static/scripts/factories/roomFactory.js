console.log('roomFactory working')
app.factory('roomFactory', ['$http', function($http) {

    var factory = {};

    factory.index = function() {
      // return $http.get('/rooms')
    }
    return factory;
}]);
