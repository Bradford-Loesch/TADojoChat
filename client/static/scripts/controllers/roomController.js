app.controller('roomsController',['$scope', '$location', 'roomFactory', function ($scope, $location,roomFactory){
    $scope.index = function(){
      // console.log('index')
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

    $scope.deleteRoom = function (idx, pos) {
      roomFactory.deleteRoom(idx).then(function(res){
        console.log(res.data)
        if (res.data.err){
          throw res.data.err
        }
        $scope.rooms.splice(pos,1);
      }).catch(console.error);
    }
  }]);
