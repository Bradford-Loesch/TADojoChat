var app = angular.module("app",["ngRoute","ngFileUpload", "angular-themer"]);

app.config(["$routeProvider", 'themerProvider', function($routeProvider, themerProvider){
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
        styles = [
          { key: 'LIGHT', label: 'Light Theme', href: ['static/assets/light.css']},
          { key: 'DARK', label: 'Dark Theme', href: ['static/assets/dark.css']},
          { key: 'DRACULA', label: 'Dracula Theme', href: ['static/assets/dracula.css']}
        ];
        themerProvider.storeTheme(true);
        themerProvider.setStyles(styles);

        var selected = themerProvider.getStoredTheme() || styles[0].key;
        console.log("SELECTED:", selected);
        themerProvider.setSelected(selected);
}]);
