app.controller("MessageController", ["$scope", "SocketFactory", "MessageFactory", function ($scope, socketFactory, MessageFactory) {
  console.log("loaded MessageController");
  $scope.allMessages = [];
  $scope.message = {};
  $scope.allUsers = [];
  $scope.user = {username: "Brad"}

  // http functions for messsages
  getMessages = function(){
    SocketFactory.getMessages().then(function(res){
      $scope.allMessages = res.data.messages;
      $scope.allUsers = res.data.users;
    });
  }
  getMessages();

  // socket functions for messages

  // post new message
  SocketFactory.sendMessage({
    'user': $scope.user.username,
    'message': $scope.message.content});
    $scope.message = {};
  }

  // receive data from message broadcasts
  SocketFactory.onBroadcast(function(res){
    $scope.allMessages.push(res.data.message);
    $scope.$apply();
  })

  // receive data from user connect broadcasts
  SocketFactory.onUserConnect(function(){
    $scope.allUsers.push(res.data.user);
    $scope.$apply();
  })

  // receive data from user disconnect broadcasts
  SocketFactory.onUserDisconnect(function(){
    $scope.allUsers.
    $scope.$apply();
  })

}]);
