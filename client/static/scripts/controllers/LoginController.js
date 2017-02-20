app.controller('LoginController',['$scope', '$location', 'loginFactory', function ($scope, $location,loginFactory){
    $scope.login = function(){
      loginFactory.login($scope.user).then(function(res){
        console.log(res.data.success)
        $scope.validations = res.data
        if(res.data.success == true){
          $location.url('/rooms')
        }
      })
    }
    $scope.logout = function(){
      // loginFactory.logout().then(function(res){
      //   console.log(res)
      //   $location.url('/login')
      // })
    }
  }]);
