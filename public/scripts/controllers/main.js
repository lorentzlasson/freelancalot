app.controller('MainCtrl', function($scope, ApiV1Service){

	ApiV1Service.getHello().then((response) => {
		$scope.data = response.data;
	});
});
