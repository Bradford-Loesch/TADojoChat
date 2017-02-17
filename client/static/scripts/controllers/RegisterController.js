app.controller('RegisterController',['$scope', '$location', 'registerFactory', function ($scope, $location ,registerFactory) {
  $scope.create = function(){
    console.log($scope.user)
    registerFactory.register($scope.user).then(function(res){
      console.log(res.data.success)
      if(res.data.success == true){
        $location.url('/rooms')
      }
    })
  }
}]);
