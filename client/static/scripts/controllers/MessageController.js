app.controller("MessageController", ["$scope", "SocketFactory", "MessageFactory", function ($scope, socketFactory, MessageFactory) {
  console.log("loaded MessageController");
  $scope.allMessages = [];
  $scope.message = {};
  $scope.user = {username: "Brad"}

  // http functions for messsages
  getMessages = function(){
    socketFactory.getMessages().then(function(res){
      $scope.allMessages = res.data.allMessages;
    }, function(){
      //errors
    });
  }
  getMessages();

  // socket functions for messages
  socketFactory.sendMessage({
    'user': $scope.user.username,
    'message': $scope.message.content});
    $scope.message = {};
  }

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
