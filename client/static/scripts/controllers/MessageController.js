/* global styles */
app.controller("MessageController", ["$scope", "$routeParams", "$location", "SocketFactory", "MessageFactory", "UserFactory", "themer", function ($scope, $routeParams, $location, SocketFactory, MessageFactory, UserFactory, themer) {
  $scope.styles = styles;
  $scope.allMessages = [];
  $scope.message = {};
  $scope.allUsers = [];
  $scope.currentUsers = [];
  $scope.user = {};
  $scope.polls = [];
  $scope.currentPoll = {};
  $scope.room = $routeParams.id;
  $scope.updateStyle = function(style){
    console.log("hi", style);
    themer.setSelected(style);
  };

  // http functions for messsages and user data
  var getMessages = function(){
    MessageFactory.getMessages().then(function(res){
      // console.log(res.data);
      $scope.allMessages = res.data.messages;
      $scope.allUsers = res.data.users;
      $scope.polls = res.data.polls;
      setCurrentPoll($scope.polls);
      console.log($scope.polls);
      return null;
    }).catch(console.error);
  };

  var getUser = function(){
    UserFactory.index().then(userData=>{
      $scope.user = userData.data;
      return null;
    }).catch(console.error);
  };

  // Join room on connect
  var joinRoom = function(){
    SocketFactory.joinRoom(parseInt($scope.room));
    updateScroll();
  };
  getUser();
  getMessages();
  setTimeout(joinRoom,500);

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
    // var d = new Date($scope.allMessages[0].created_at);
    // $scope.time = date
    $scope.$apply();
    updateScroll();
  });

  SocketFactory.onServerMessage(function(data) {
    if (data.room == $scope.room || data.room == null) {
      serverMessage = {
        'username': 'from server',
        'message': data.output
      }
      $scope.allMessages.push(serverMessage);
      $scope.$apply();
      updateScroll();
    }
  });

  setCurrentPoll = function(polls) {
    for (var question in polls) {
      if (polls[question]['open']) {
        $scope.currentPoll.question = question;
        $scope.currentPoll.answers = polls[question]['answers'];
      }
    }
  };

  SocketFactory.onPoll(function(data) {
    // $scope.polls.push(data);
    console.log(data);
    if ('question' in data) {
      $scope.currentPoll.question = data.question;
      $scope.currentPoll.answers = [];
      for (var i = 0; i < data.answers.length; i++) {
        $scope.currentPoll.answers.push({
          'answer': data.answers[i],
          'number': i+1,
          'votes': "0"
        });
      }
    }
    $scope.$apply();
  });

  SocketFactory.onPollUpdate(function(data) {
    $scope.currentPoll.answers = data;
    $scope.$apply();
  });

  SocketFactory.onPollClose(function(data) {
    $scope.currentPoll = {};
    $scope.$apply();
  });

  // set current user list
  var setCurrentUsers = function(data){
    // console.log(data);
    $scope.currentUsers = [];
    for (var i = 0; i < data.currentUsers.length; i++) {
      for (var j = 0; j < $scope.allUsers.length; j++) {
        if (data.currentUsers[i] === $scope.allUsers[j].id) {
          $scope.currentUsers.push($scope.allUsers[j]);
        }
      }
    }
    $scope.$apply();
  };

  // reveive data from user connect broadcasts
  SocketFactory.onUserConnect(function(data) {
    if ('newuser' in data) {
      $scope.allUsers.push(data.newuser);
    }
    setCurrentUsers(data);
  });

  // receive data from user disconnect broadcasts
  SocketFactory.onUserDisconnect(function(data) {
    setCurrentUsers(data);
    $scope.$apply();
  });

  // leave the chat room when the window closes
  $scope.$on("$locationChangeStart", function() {
    SocketFactory.disconnectRoom(parseInt($scope.room));
  });

}]);
