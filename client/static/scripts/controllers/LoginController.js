app.controller('LoginController',['$scope', '$location', 'loginFactory', function ($scope, $location,loginFactory){
    $scope.login = function(){
      loginFactory.login($scope.user).then(function(res){
        console.log(res.data.err)
        $scope.validations = res.data.err
        if(res.data.success == true){
          $location.url('/rooms')
        }
      })
    }
    $scope.logout = function(){
      loginFactory.logout().then(function(res){
        console.log(res)
        $location.url('/login')
      })
    }
  }]);
