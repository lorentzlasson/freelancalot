app.controller('LoginCtrl', function($scope, Auth) {

    $scope.login = (credentials) => {
        Auth.login(credentials).then((response) => {
            $scope.data = response;
        });
    }
});