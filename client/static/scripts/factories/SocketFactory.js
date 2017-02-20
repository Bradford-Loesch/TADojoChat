app.factory('SocketFactory',['$http', function ($http, SocketFactory) {
  var factory = {};
  var socket = io.connect()


  factory.sendMessage = function(data) {
    socket.emit('send_message', data);
  }

  factory.onBroadcast = function(cb) {
    socket.on('broadcast_message', cb);
  }


  return factory;
}])
