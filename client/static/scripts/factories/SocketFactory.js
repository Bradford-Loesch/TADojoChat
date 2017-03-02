
app.factory("SocketFactory",[function () {
  var factory = {};
  var socket = io.connect();


  factory.joinRoom = function(data) {
    socket.emit("join_room", data);
  };

  factory.leaveRoom = function(data) {
    socket.emit("leave_room", data);
  };

  factory.disconnectRoom = function(data) {
    socket.emit("disconnect_room", data);
  };

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
