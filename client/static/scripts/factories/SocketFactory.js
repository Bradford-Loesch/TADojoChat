app.factory("socketFactory",[function () {
  var factory = {};
  console.log("loaded socket factory");
  factory.socket = io.connect();
  return factory;
}]);
