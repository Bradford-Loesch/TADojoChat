app.controller("UserController", ["$scope", "Upload", "$location","$routeParams", "UserFactory", "$window", function ($scope, Upload, $location,$routeParams, UserFactory, $window) {
  $scope.login = function(){
    UserFactory.login($scope.user).then(res=>{
      // console.log(res);
      if(!res.data.err){
        $location.url("/rooms");
      } else {
        $scope.validations = res.data.err.items[0];
        throw res.data.err;
      }
      return null;
    }).catch(console.error);
  };
  $scope.create = function(){
    // console.log("Creating");
    // console.log($scope.user);
    UserFactory.register($scope.user).then(res=>{
      // console.log(res.data.success);
      if(!res.data.err){
        $location.url("/rooms");
      } else {
        $scope.errors = (res.data.err.items)
        throw res.data.err;
      }
      return null;
    }).catch(console.error);
  };
  $scope.logout = function(){
    UserFactory.logout().then(function(res){
      // console.log(res);
      $location.url("/login");
      return null;
    }).catch(console.error);
  };
  $scope.index = function(){
    UserFactory.index().then(userData=>{
      delete userData.password
      userData.data.birthday = new Date(userData.data.birthday);
      $scope.user = userData.data;
      // console.log("***********user data in UserController**********");
      // console.log(userData.data);
      return null;
    }).catch(console.error);
    $scope.getRooms()
  };
  $scope.upload = function (){
    $scope.user.avatar = $scope.file;
    Upload.upload({
      url: "/profile",
      data: $scope.user
    }).then(function (res) {
      $window.location.reload();
      console.log("here");
      console.log(res);
      console.log("Success " + res.config.data.filename + "uploaded. Response: ",res.data);
      return null;
    }).catch(function (res) {
      console.log("Error status: " + res.status);
    });
    console.log($scope.file);
  };
  $scope.getUser = function(){
    console.log($routeParams)
    UserFactory.getUser($routeParams.id).then(data=>{
      data.data.birthday = new Date(data.data.birthday);
      console.log(data.data)
      $scope.otheruser = data.data
    })
  }
  $scope.submit = function() {
    if (!$scope.form.file || $scope.form.file.$valid) {
      console.log($scope.file);
      $scope.upload();
    }else{
      console.log("file is not valid");
    }
  };
  $scope.getRooms = function() {
    UserFactory.getrooms().then(data=>{
      console.log(data.data)
      $scope.roomsIn = data.data
    })
  }

}]);
