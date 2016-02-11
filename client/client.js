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

app.controller('EventController', ['$scope', '$http', function($scope, $http){
    $scope.states =['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin', 'Wyoming'];
    $scope.events = [];

    $scope.getEvents = function(){

        var url = '/event/' + $scope.selectState;

        $http.get(url).then(function(response){
            console.log(response);
            $scope.events = response.data;
        });
    };

    $scope.linkToEvent = function(event){
        console.log("This is event id:", event.id);
        $http.get('/event/' + event.id).then(function(response){
            console.log(response);
            $scope.event = response.data;
        });
    };
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