app.controller("MessageController", ["$scope", "$routeParams", "SocketFactory", "MessageFactory", function ($scope, $routeParams, SocketFactory, MessageFactory) {
  $scope.allMessages = [];
  $scope.message = {};
  $scope.allUsers = [];
  $scope.user = {username: "aethelwulf"}
  $scope.room = $routeParams.room

  // http functions for messsages
  getMessages = function(){
    MessageFactory.getMessages().then(function(res){
      console.log("response from getMessages");
      console.log(res);
      $scope.allMessages = res.data.messages;
      $scope.allUsers = res.data.users;
    });
  };
  getMessages();

  // socket functions for messages
  // receive data from user connect broadcasts
  SocketFactory.onUserConnect(function(data){
    console.log("data from user connect");
    console.log(data);
    console.log("$scope.allUsers");
    console.log($scope.allUsers);
    if ($scope.allUsers.length == 0) {
      getMessages();
    }
    else {
      $scope.allUsers.push(data);
      $scope.$apply();
    }
  });

  // post new message
  $scope.sendMessage = function() {
    console.log('in send message');
    console.log($scope.message);
    SocketFactory.sendMessage({
      'user': 1,
      'room': parseInt($scope.room),
      'message': $scope.message.content});
      $scope.message = {};
  }


  // receive data from message broadcasts
  SocketFactory.onBroadcast(function(data){
    console.log(data);
    $scope.allMessages.push({
      'user': data.username,
      'message': data.message});
    console.log($scope.allMessages);
    $scope.$apply();
  });


  // receive data from user disconnect broadcasts
  SocketFactory.onUserDisconnect(function(){
    $scope.allUsers.
    $scope.$apply();
  });

}]);
