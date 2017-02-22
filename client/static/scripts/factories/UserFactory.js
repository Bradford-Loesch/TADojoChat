app.factory("UserFactory", ["$http", "$routeParams", function ($http, $routeParams) {

  var factory = {};

    // Retrieve a list of all users
  factory.index = function() {
    return $http.get("/profiles");
  };

    // Retrieve a subset of users
    // Possibly refactor to get with filter information in url
  factory.subset = function(filter) {
    throw "Not Implemented";
    // return $http.post('/profiles/subset', filter)
  };
  factory.get = function(id) {
    if (id){
      return $http.get("/profile/"+id);
    } else {
      return $http.get("/profile");
    }
  };
  factory.login = function(user) {
    return $http.post("/login",user);
  };

  factory.register = function(user) {
    return $http.post("/register", user);
  };

  return factory;
}]);
