var app = angular.module('myApp', ['ui.router']);

app.config(($stateProvider, $urlRouterProvider) => {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('out', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl'
        })
        .state('in', {
            url: '',
            templateUrl: "views/master.html"
        })
        .state('in.main', {
            url: "/main",
            templateUrl: "views/main.html",
            controller: 'MainCtrl'
        })
        .state('in.extra', {
            url: "/extra",
            templateUrl: "views/extra.html",
            controller: 'ExtraCtrl'
        })
});

app.config(($httpProvider) => {
    $httpProvider.interceptors.push('RespErrInjector');
});