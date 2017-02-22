app.controller("MessageController", ["$scope", "$routeParams", "SocketFactory", "MessageFactory", function ($scope, $routeParams, SocketFactory, MessageFactory) {
  $scope.allMessages = [];
  $scope.message = {};
  $scope.allUsers = [];
  $scope.user = {};
  $scope.room = $routeParams.id;

  // http functions for messsages
  var getMessages = function(){
    MessageFactory.getMessages().then(function(res){
      console.log("response from getMessages");
      console.log(res);
      $scope.allMessages = res.data.messages;
      $scope.allUsers = res.data.users;
      return null;
    }).catch(console.error);
  };
  getMessages();

  // socket functions for messages
  // receive data from user connect broadcasts
  SocketFactory.onUserConnect(function(res){
    console.log("data from user connect");
    console.log(res.data);
    console.log("$scope.allUsers");
    console.log($scope.allUsers);
    if ($scope.allUsers.length === 0) {
      getMessages();
    }    else {
      $scope.allUsers.push(res.data);
      $scope.$apply();
    }
  });

  // post new message
  $scope.sendMessage = function() {
    console.log("in send message");
    console.log($scope.message);
    SocketFactory.sendMessage({
      "room": parseInt($scope.room),
      "message": $scope.message.content});
    $scope.message = {};
  };



  // receive data from message broadcasts
  SocketFactory.onBroadcast(function(data){
    console.log("****** received broadcast data **********");
    console.log(data);
    $scope.allMessages.push({
      "user": data.username,
      "message": data.message});
    console.log($scope.allMessages);
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
