app.controller("roomsController",["$scope", "$location", "roomFactory", function ($scope, $location,roomFactory){
  $scope.index = function(){
    console.log("inde");
    roomFactory.index().then(function(res){
      console.log(res.data.rooms);
      $scope.rooms = res.data.rooms;
      return null;
    }).catch(console.error);
  };
  $scope.create = function(){
    console.log($scope.room);
    roomFactory.create($scope.room).then(function(res){
      console.log(res.data);
      return null;
    }).catch(console.error);
  };
}]);
