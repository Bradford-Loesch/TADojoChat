factory('socketFactory', function () {
  var socket = io.connect()
  var factory = {};
  factory.onNewMessage = function (cb) {
    socket.on("new-message", cb);
  }
  return factory;
}).
