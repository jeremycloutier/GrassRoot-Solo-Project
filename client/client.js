var app = angular.module('grassrootApp', ['ngRoute']);
var eventID;

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'views/content.html',
            controller: 'EventController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/success', {
            templateUrl: 'views/success.html',
            controller: 'SuccessController'
        })
        .when('/failure', {
            templateUrl: '../server/public/views/failure.html',
            controller: 'FailController'
        })
        .when('/event', {
            templateUrl: 'views/event.html',
            controller: 'DisplayController'
        })
        .when('/home', {
            templateUrl: 'views/user.html',
            controller: 'EventController'
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
}]);

app.controller('MainController', ['$scope', '$http', function($scope, $http){
    $scope.selectedEvent = {};
}]);

app.controller('EventController', ['$scope', '$http', function($scope, $http){
    $scope.states =["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
        "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
        "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
        "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
    $scope.events = [];

    $scope.getEvents = function(){
        var url = '/event/' + $scope.selectState;

        $http.get(url).then(function(response){
            console.log(response);
            $scope.events = response.data;
        });
    };

    $scope.chooseEvent = function(event){
        console.log("This is event id:", event.id);
        eventID = event.id;
    };
}]);

app.controller('DisplayController', ['$scope', '$http', function($scope, $http){
    $scope.linkToEvent = function(){
        $http.get('/event/info/' + eventID).then(function(response){
            console.log(response);
            $scope.selectedEvent = response.data[0];
            console.log($scope.selectedEvent.title);
        });
    };
    $scope.linkToEvent();
}]);

app.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.submitLogin = function(){
        console.log($scope.data);
        $http.post('/', $scope.data).then(function(response){
            //route change
            var newRoute = response.data;
            $location.path(newRoute);
            console.log(response);
        }, function(response){
            //error
        });
    };

    $scope.logout = function(){
        $http.get('/logout').then(function(){
            console.log('logout clicked');
            $location.path('/');
        })
    };
}]);