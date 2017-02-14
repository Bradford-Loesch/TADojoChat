var app = angular.module("app", ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl:"partials/register.html"
        })
        .when('/login',{
            templateUrl:"partials/login.html"
        })
        .otherwise({
            redirect_to: '/'
        });
})
