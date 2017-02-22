app.controller("UserController", ["$scope", "$location", "UserFactory", function ($scope, $location, UserFactory) {
  $scope.login = function(){
    UserFactory.login($scope.user).then(res=>{
      console.log(res)
      if(!res.data.err){
        $location.url("/rooms");
      } else {
        $scope.validations = res.data.err.items[0]
        throw res.data.err;
      }
      return null;
    }).catch(console.error);
  };
  $scope.create = function(){
    console.log("Creating");
    console.log($scope.user);
    UserFactory.register($scope.user).then(res=>{
      console.log(res.data.success);
      if(!res.data.err){
        $location.url("/rooms");
      } else {
        throw res.data.err;
      }
      return null;
    }).catch(console.error);
  };
  $scope.logout = function(){
    UserFactory.logout().then(function(res){
      console.log(res)
      $location.url('/login')
    })
  }
  $scope.index = function(){
    UserFactory.index().then(userData=>{
      $scope.user = userData.data;
      console.log(userData.data)
      // return null;
    }).catch(console.error);
  };
  $scope.update = function(){
    console.log($scope.user)
    UserFactory.update($scope.user).then(data=>{
      console.log(data)
    })
  }
}]);
