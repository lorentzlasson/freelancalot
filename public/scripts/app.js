var app = angular.module('myApp', ['ui.router']);

app.config(($stateProvider, $urlRouterProvider) => {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('out', {
            url: '',
            templateUrl: 'views/out.html',
            controller: 'OutCtrl',
            redirectTo: 'out.login'
        })
        .state('out.login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .state('out.register', {
            url: '/register',
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl'
        })
        .state('in', {
            url: '',
            templateUrl: 'views/in.html',
            controller: 'InCtrl',
            redirectTo: 'in.main'
        })
        .state('in.main', {
            url: '',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .state('in.extra', {
            url: '/extra',
            templateUrl: 'views/extra.html',
            controller: 'ExtraCtrl'
        })
});

app.config(($httpProvider) => {
    $httpProvider.interceptors.push('RespErrInjector');
});

// enable "redirectTo" attribute in $stateProvider.state to acheive defaul child state
app.run(($rootScope, $state) => {
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
        if (to.redirectTo) {
            evt.preventDefault();
            $state.go(to.redirectTo, params)
        }
    });
});