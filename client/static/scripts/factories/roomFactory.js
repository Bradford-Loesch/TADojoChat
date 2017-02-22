console.log('roomFactory working')
app.factory('roomFactory', ['$http', function($http) {

    var factory = {};
    var rooms = [];

    factory.index = function() {
      return $http.get('/rooms')
    }
    factory.create = function(rooms){
      console.log(rooms)
      return $http.post('/rooms', rooms)
    }
    factory.deleteRoom = function (idx) {
      rooms.splice(idx,1)
    }
    return factory;
}]);
