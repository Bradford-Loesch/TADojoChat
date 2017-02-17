app.factory('socketFactory',['$http', function ($http, socketFactory) {
  var factory = {};
  console.log("loaded socket factory");
  factory.socket = io.connect()

  return factory;
}])
