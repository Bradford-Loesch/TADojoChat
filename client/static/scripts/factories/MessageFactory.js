app.factory("MessageFactory",["$http", "$routeParams", function ($http, $routeParams) {
  var factory = {};

  factory.getMessages = function() {
    return $http.get(`/room/${$routeParams.room}`);
  };

  return factory;
}]);
