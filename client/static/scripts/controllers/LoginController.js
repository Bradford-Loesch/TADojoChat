app.controller('LoginController',['$scope', '$location', 'loginFactory', function ($scope, $location,loginFactory){
    $scope.login = function(){
      loginFactory.login($scope.user).then(function(res){
        if(res.data.success == true){
          $location.url('/rooms')
        }
      })
    }
  }]);
