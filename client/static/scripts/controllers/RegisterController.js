app.controller('RegisterController',['$scope', '$location', 'registerFactory', function ($scope, $location ,registerFactory) {
  $scope.create = function(){
    console.log($scope.user)
    registerFactory.register($scope.user).then(function(res){
      console.log(res.data.err.items)

      if(res.data.success == true){
        $location.url('/rooms')
      }
      else{
        $scope.validations = res.data.err.items
      }
    })
  }
}]);
