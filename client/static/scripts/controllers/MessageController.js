app.controller("MessageController", ["$scope", "$routeParams", "SocketFactory", "MessageFactory", "UserFactory", function ($scope, $routeParams, SocketFactory, MessageFactory, UserFactory) {
  $scope.allMessages = [];
  $scope.message = {};
  $scope.allUsers = [];
  $scope.user = {};
  $scope.room = $routeParams.id;

  // http functions for messsages and user data
  getMessages = function(){
    MessageFactory.getMessages().then(function(res){
      $scope.allMessages = res.data.messages;
      $scope.allUsers = res.data.users;
      console.log($scope.allMessages);
      return null;
    }).catch(console.error);
  };

  getUser = function(){
    UserFactory.index().then(userData=>{
      $scope.user = userData.data;
      // return null;
    }).catch(console.error);
  };

  // Join room on connect
  joinRoom = function(){
    SocketFactory.joinRoom(parseInt($scope.room));
  }
  joinRoom();
  getUser();
  getMessages();

  // socket functions for messages
  // receive data from user connect broadcasts
  SocketFactory.onUserConnect(function(res){
    // console.log("data from user connect");
    // console.log(res.data);
    // console.log("$scope.allUsers");
    // console.log($scope.allUsers);
    if ($scope.allUsers.length === 0) {
      getMessages();
    }    else {
      $scope.allUsers.push(res.data);
      $scope.$apply();
    }
  });

  // post new message
  $scope.sendMessage = function() {
    SocketFactory.sendMessage({
      "room": parseInt($scope.room),
      "message": $scope.message.content});
    $scope.message = {};
  };



  // receive data from message broadcasts
  SocketFactory.onBroadcast(function(data){
    $scope.allMessages.push(data);
    $scope.$apply();
  });


  // receive data from user disconnect broadcasts
  SocketFactory.onUserDisconnect(function(data){
    for (var i = 0; i < $scope.allUsers.length; i++) {
      if ($scope.allUsers[i].id === data.id) {
        $scope.allUsers.splice(i, 1);
      }
    }
    $scope.$apply();
  });

}]);
