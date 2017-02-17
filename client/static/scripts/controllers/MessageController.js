app.controller("MessageController", ["$scope", "socketFactory", function ($scope, socketFactory) {
  console.log("loaded MessageController");
  $scope.allMessages = [];
  $scope.message = {};

  $scope.createMessage = function () {
    console.log($scope.message);
    socketFactory.socket.emit('send_message', {message: $scope.message});
    $scope.message = {};
  }
  socketFactory.socket.on('broadcast_message', function(data) {
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
