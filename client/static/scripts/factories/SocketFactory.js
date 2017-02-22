app.factory("SocketFactory",["$routeParams", function ($routeParams) {
  var factory = {};
  var socket = io.connect();


  factory.sendMessage = function(data) {
    socket.emit("send_message", data);
  };

  factory.onBroadcast = function(callback) {
    socket.on("broadcast_message", callback);
  };

  factory.onUserConnect = function(callback) {
    socket.on("broadcast_user_connect", callback);
  };

  factory.onUserDisconnect = function(callback) {
    socket.on("broadcast_user_disconnect", callback);
  };

  return factory;
}]);
