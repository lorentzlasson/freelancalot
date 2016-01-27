app.controller('MainCtrl', function($scope, ApiV1Service){

	ApiV1Service.getUser().then((response) => {
		$scope.user = response.data;
	});
});
