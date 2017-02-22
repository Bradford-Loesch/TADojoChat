console.log('roomFactory working')
app.factory('roomFactory', ['$http', function($http) {

    var factory = {};
    var rooms = []

    factory.index = function() {
      return $http.get('/rooms')
    }
    factory.create = function(rooms){
      console.log(rooms)
      return $http.post('/rooms', rooms)
    }

    factory.deleteRoom = function (idx) {
      rooms.splice(idx, 1)
    }

    return factory;
}]);













// factory.index = function (callback) {
//   callback(rooms)
// }
//
// factory.create = function (room, callback) {
//   rooms.push(room)
//   callback(rooms)
// }
//
// factory.deleteRoom = function (id, callback) {
//   rooms.splice(id,1)
//   callback(rooms)
// }
