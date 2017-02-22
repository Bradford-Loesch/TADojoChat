app.controller("UserController", ["$scope", "$location", "UserFactory", function ($scope, $location, UserFactory) {
  $scope.login = function(){
    UserFactory.login($scope.user).then(res=>{
      if(!res.data.err){
        $location.url("/rooms");
      } else {
        throw res.data.err;
      }
      return null;
    }).catch(console.error);
  };
  $scope.create = function(){
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
  $scope.get = function(id){
    UserFactory.get(id).then(userData=>{
      $scope.user = userData;
      return null;
    }).catch(console.error);
  };
}]);
