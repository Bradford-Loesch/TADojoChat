app.factory('socketFactory',['$http', function ($http) {
  var factory = {};
  console.log("loaded socket factory");
  factory.socket = io.connect()
  
  factory.sendMessage = function (message) {
    factory.socket.emit('send_message', message);
  }
  factory.onBroadcast = function (callback) {
    factory.socket.on('broadcast_message', callback);
  }
  return factory
}])
