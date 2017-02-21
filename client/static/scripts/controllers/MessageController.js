console.log("loaded MessageController");
app.controller("MessageController", ["$scope", "messageFactory", "socketFactory", function ($scope, messageFactory, socketFactory) {
  $scope.allMessages = [];
  $scope.message = {};
  $scope.user = {username: "Brad"}

  getMessages = function(){
    messageFactory.index().then(function(res){
      $scope.allMessages = res.data.allMessages;
    }, function(){
      //errors
    });
  }

  // getMessages();
  $scope.createMessage = function () {
    messageFactory.createMessage($scope.message, function () {
      console.log('in callback');

    })
  }

  // $scope.createMessage = function () {
  //   console.log($scope.message);
  socketFactory.sendMessage({
    'user': $scope.user.username,
    'message': $scope.message.content
  });
  //   $scope.message = {};
  //   // messageFactory.createMessage($scope.message)
  // }
  //
  socketFactory.onBroadcast(function(data) {
    $scope.allMessages.push(data);
    $scope.$apply();
  })
}]);









// $scope.setMessages = function() {
//   MessageFactory.index(function (data) {
//     $scope.messages = data;
//   });
// }
// $scope.setMessages();
//
// function setMessage(data) {
//   $scope.message = data;
//   $scope.newMessage = {};
// }
//
// $scope.show = function() {
//   MessageFactory.show(setMessage);
// }
//
// $scope.create = function (newMessage)
// {
//   MessageFactory.create(newMessage, setMessages);
// };
//
// $scope.update = function() {
//   MessageFactory.update($scope.newMessage, setMessages);
//   newMessage = {};
// }
//
// $scope.delete = function(id) {
//   MessageFactory.delete(setMessages);
// }
