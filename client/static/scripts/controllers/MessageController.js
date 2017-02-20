app.controller("MessageController", ["$scope", "SocketFactory", "MessageFactory", function ($scope, socketFactory, MessageFactory) {
  console.log("loaded MessageController");
  $scope.allMessages = [];
  $scope.message = {};
  $scope.allUsers = [];
  $scope.user = {username: "Brad"}

  // http functions for messsages
  getMessages = function(){
    SocketFactory.getMessages().then(function(res){
      // $scope.allMessages = res.data.allMessages;
      print res.data
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
  SocketFactory.onBroadcast(function(data){
    $scope.allMessages.push(data);
    $scope.$apply();
  })

  // receive data from user connect broadcasts
  SocketFactory.onUserConnect(function(){
    $scope.allUsers.push(DATA);
    $scope.$apply();
  })

  // receive data from user disconnect broadcasts
  SocketFactory.onUserDisconnect(function(){
    $scope.allUsers.
    $scope.$apply();
  })

}]);
