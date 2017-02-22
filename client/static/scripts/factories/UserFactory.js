
app.factory("UserFactory", ["$http", function ($http) {

  var factory = {};

  factory.login = function(user) {
    return $http.post("/login",user);
  };

  factory.register = function(user) {
    return $http.post("/register", user);
  };
  factory.logout = function(){
    return $http.get('/logout')
  }
  factory.index = function(){
    return $http.get('/profile')
  }
  return factory;
}]);
