app.controller('roomsController',['$scope', '$location', 'roomFactory', function ($scope, $location,roomFactory){

  $scope.index = function(){
    console.log('inde')
    roomFactory.index().then(function(res){
      console.log(res.data.rooms)
      $scope.rooms = res.data.rooms
    })
  }
  $scope.create = function(){
    console.log($scope.room)
    roomFactory.create($scope.room).then(function(res){
      console.log(res.data)
    })
  }
  $scope.deleteRoom = function (idx) {
    roomFactory.deleteRoom($scope.room)
  }
}]);



  // function setRooms(data) {
  //   $scope.rooms = data;
  //   $scope.room = {};
  // }
  //
  // $scope.room = {};
  // $scope.rooms = {};
  //
  // $scope.index = function () {
  //   roomFactory.index(setRooms)
  // }
  //
  // $scope.index()
  // $scope.create = function () {
  //   roomFactory.create($scope.room, setRooms)
  // }
  //
  // $scope.deleteRoom = function(id){
  //   roomFactory.deleteRoom(id,setRooms);
  // }
