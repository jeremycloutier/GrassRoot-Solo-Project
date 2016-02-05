var app = angular.module('grassrootApp', ['ngRoute']);

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
            controller: 'EventController'
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

app.controller('RegisterController', ['$scope', function($scope){

}]);

app.controller('SuccessController', ['$scope', function($scope){

}]);

app.controller('FailController', ['$scope', function($scope){

}]);

app.controller('EventController', ['$scope', function($scope){

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
}]);