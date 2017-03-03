// console.log('roomFactory working')
app.factory("roomFactory", ["$http", function($http) {

  var factory = {};

  factory.index = function() {
    return $http.get("/rooms");
  };
  factory.create = function(rooms){
    console.log(rooms);
    return $http.post("/rooms", rooms);
  };
  factory.deleteRoom = function (idx) {
    return $http.delete("/room/"+idx);
  };
  return factory;
}]);
