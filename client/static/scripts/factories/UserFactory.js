
app.factory("UserFactory", ["$http", function ($http) {

  var factory = {};

  factory.login = function(user) {
    return $http.post("/login",user);
  };

  factory.register = function(user) {
    return $http.post("/register", user);
  };
  factory.logout = function(){
    return $http.get("/logout");
  };
  factory.index = function(){
    return $http.get("/profile");
  };
  factory.update = function(user){
    console.log(user)
    return $http.post('/profile',user)
  }
  factory.getUser = function(id){
    return $http.get('/profile/' + id)
  }
  return factory;
}]);
