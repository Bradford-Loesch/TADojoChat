app.controller("MessageController", ["$scope", "$routeParams", "$location", "SocketFactory", "MessageFactory", "UserFactory", function ($scope, $routeParams, $location, SocketFactory, MessageFactory, UserFactory) {
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
    $scope.allMessages.push(data);
    var d = new Date($scope.allMessages[0].created_at)
    // $scope.time = date
    $scope.$apply();
  });

  // set current user list
  setCurrentUsers = function(data){
    $scope.currentUsers = [];
    for (var i = 0; i < data.currentUsers.length; i++) {
      for (var j = 0; j < $scope.allUsers.length; j++) {
        if (data.currentUsers[i] == $scope.allUsers[j].id) {
          $scope.currentUsers.push($scope.allUsers[j]);
        }
      }
    }
  }

  // reveive data from user connect broadcasts
  SocketFactory.onUserConnect(function(data) {
    setCurrentUsers(data);
    if ('newuser' in data) {
      $scope.allUsers.push(data.newuser);
    }
    $scope.$apply();
    console.log("*********currentUsers**************");
    console.log($scope.currentUsers);
  })

  // receive data from user disconnect broadcasts
  SocketFactory.onUserDisconnect(function(data) {
    console.log("***********disconnection");
    setCurrentUsers(data);
    $scope.$apply();
  });

  // leave the chat room when the window closes
  $scope.$on('$locationChangeStart', function(event) {
    SocketFactory.disconnectRoom(parseInt($scope.room));
  });

}]);
