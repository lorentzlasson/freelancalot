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
            redirectTo: 'in.main',
            data: {
                permission: 'authenticated'
            }
        })
        .state('in.main', {
            url: '/main',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .state('in.extra', {
            url: '/extra',
            templateUrl: 'views/extra.html',
            controller: 'ExtraCtrl',
            data: {
                permission: 'admin'
            }
        })
});

app.config(($httpProvider) => {
    $httpProvider.interceptors.push('RespErrInjector');
});

app.run((AuthService) => {
    AuthService.loadCurrentUser();
});

// enable "redirectTo" attribute in $stateProvider.state to acheive defaul child state
// change to better solution when available (see: https://github.com/angular-ui/ui-router/issues/27)
app.run(($rootScope, $state, AuthService) => {
    $rootScope.$on('$stateChangeStart', function(evt, to, toParams, from, fromParams) {
        if (to.redirectTo) {
            evt.preventDefault();
            $state.go(to.redirectTo, toParams);
        }

        else if (to.data) {
            var permission = to.data.permission;
            if (permission){
                var authorized = AuthService.authorized(permission);
                if (!authorized) {
                    evt.preventDefault();
                };
            }
        };
    });
});