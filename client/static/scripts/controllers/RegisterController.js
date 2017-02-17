app.controller('RegisterController',['$scope',  'registerFactory', function ($scope, registerFactory) {

    $scope.create = function(){
      console.log($scope.user)
      registerFactory.register($scope.user).then(function(res){
        console.log(res.data)
      })
    }
  }]);
