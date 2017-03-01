app.controller("MessageController", ["$scope", "$routeParams", "$window", "SocketFactory", "MessageFactory", "UserFactory", function ($scope, $routeParams, $window, SocketFactory, MessageFactory, UserFactory) {
  $scope.allMessages = [];
  $scope.message = {};
  $scope.allUsers = [];
  $scope.currentUsers = [];
  $scope.user = {};
  $scope.room = $routeParams.id;

  // http functions for messsages and user data
  getMessages = function(){
    MessageFactory.getMessages().then(function(res){
      $scope.allMessages = res.data.messages;
      $scope.allUsers = res.data.users;
      // console.log("*********allUsers on load***********");
      // console.log($scope.allUsers);
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
    console.log("Joining room");
    SocketFactory.joinRoom(parseInt($scope.room));
  }
  getUser();
  getMessages();
  joinRoom();

  // post new message
  $scope.sendMessage = function() {
    SocketFactory.sendMessage({
      "room": parseInt($scope.room),
      "message": $scope.message.content});
    $scope.message = {};
  };

  // receive data from message broadcasts
  SocketFactory.onBroadcast(function(data) {
    console.log($scope.allMessages)
    $scope.$apply();
  });

  // reveive data from user connect broadcasts
  SocketFactory.onUserConnect(function(data) {
    console.log("received user connect broadcast");
    console.log(data);
    // console.log($scope.allUsers);
    // console.log($scope.currentUsers);
    $scope.currentUsers = [];
    // for (var i = 0; i < data.currentUsers.length; i++) {
    //   for (var j = 0; j < $scope.allUsers.length; i++) {
    //     if (data.currentUsers[i] == $scope.allUsers[j].id) {
    //       $scope.currentUsers.push($scope.allUsers[j]);
    //     }
    //   }
    // }
    if ('newuser' in data) {
      $scope.allUsers.push(data.newuser);
    }
    console.log($scope.currentUsers);
  })

  // receive data from user disconnect broadcasts
  SocketFactory.onUserDisconnect(function(data) {
    for (var i = 0; i < $scope.allUsers.length; i++) {
      if ($scope.allUsers[i].id == data.id) {
        $scope.allUsers.splice(i, 1);
      }
    }
    $scope.$apply();
  });

  // leave the chat room when the window closes
  $window.onbeforeunload = function(){
    SocketFactory.disconnectRoom($scope.user.username);
  }

}]);
