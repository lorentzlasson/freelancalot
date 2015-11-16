app.controller('RegisterCtrl', function($scope, Auth) {

    $scope.register = (credentials) => {
        Auth.register(credentials).then((response) => {
            $scope.data = response.data;
        }, (error) => {
        	console.error(error.data);
        });
    }
});