app.controller('LoginCtrl', function($scope, AuthService) {

    $scope.login = (credentials) => {
        AuthService.login(credentials).then((response) => {
            $scope.data = response.data;
        });
    }
});