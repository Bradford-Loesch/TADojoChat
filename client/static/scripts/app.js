var app = angular.module("app", ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl:"partials/register.html"
        })
        .when('/login',{
            templateUrl:"partials/login.html"
        })
        .when('/rooms',{
            templateUrl:"partials/dashboard.html"
        })
        .when('/chatroom/1',{
            templateUrl:"partials/chatroom.html"
        })


        .otherwise({
            redirect_to: '/'
        });
})
