var app = angular.module("app",["ngRoute", "ngFileUpload", "ngSantitize", "dbaq.emoji"]);

app.config(function($routeProvider){
  $routeProvider
        .when("/",{
          templateUrl:"partials/login.html"
        })
        .when("/login",{
          templateUrl:"partials/login.html"
        })
        .when("/register",{
          templateUrl:"partials/register.html"
        })

        .when("/rooms",{
          templateUrl:"partials/dashboard.html"
        })
        .when("/chatroom/:id",{
          templateUrl:"partials/chatroom.html"
        })
        .when("/newRoom",{
          templateUrl:"partials/newRoom.html"
        })
        .when("/user",{
          templateUrl:"partials/user.html"
        })
        .when("/edit/user",{
          templateUrl:"partials/edit.html"
        })
        .when("/testing",{
          templateUrl:"partials/test.html"
        })
        .otherwise({
          redirect_to: "/"
        });
});
