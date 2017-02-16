app.controller("MessageController", ["$scope", "MessageFactory", "socketFactory", function ($scope, MessageFactory, socketFactory) {
    $scope.messages = [];
    $scope.message = {};

    $scope.setMessages = function() {
        MessageFactory.index(function (data) {
            $scope.messages = data;
        });
    }
    $scope.setMessages();

    function setMessage(data) {
        $scope.message = data;
        $scope.newMessage = {};
    }

    $scope.show = function() {
        MessageFactory.show(setMessage);
    }

    $scope.create = function (newMessage)
    {
        MessageFactory.create(newMessage, setMessages);
    };

    $scope.update = function() {
        MessageFactory.update($scope.newMessage, setMessages);
        newMessage = {};
    }

    $scope.delete = function(id) {
        MessageFactory.delete(setMessages);
    }
    socketFactory.onNewMessage(function(data) {
      
    })
}]);
