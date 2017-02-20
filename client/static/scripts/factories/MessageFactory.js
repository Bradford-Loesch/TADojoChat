app.factory('MessageFactory',['$http', '$routeParams', function ($http, $routeParams, MessageFactory) {
  var factory = {};

  factory.getMessages = function() {
    return $http.get(`/room/${routeParams.room`)
  }

  return factory;
}])
