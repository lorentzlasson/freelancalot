app.controller('RegisterCtrl', function($scope, AuthService) {

    $scope.register = (credentials) => {
        AuthService.register(credentials).then((response) => {
            $scope.data = response.data;
        });
    }
});