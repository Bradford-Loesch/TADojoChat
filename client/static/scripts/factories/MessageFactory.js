app.factory("MessageFactory",["$http", "$routeParams", function ($http, $routeParams) {
  var factory = {};

  factory.getMessages = function() {
    console.log(`/room/${$routeParams.id}`);
    return $http.get(`/room/${$routeParams.id}`);
  };

  return factory;
}]);
