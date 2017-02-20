app.controller('roomsController',['$scope', '$location', 'roomFactory', function ($scope, $location,roomFactory){
    $scope.index = function(){
      console.log('inde')
      roomFactory.index().then(function(res){
        console.log(res)
      })
    }
  }]);
