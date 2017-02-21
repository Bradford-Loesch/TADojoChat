
app.factory("UserFactory", ["$http", function ($http) {

  var factory = {};

  factory.login = function(user) {
    return $http.post("/login",user);
  };

  factory.register = function(user) {
    return $http.post("/register", user);
  };

  return factory;
}]);
