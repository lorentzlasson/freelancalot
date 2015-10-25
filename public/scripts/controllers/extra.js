app.controller('ExtraCtrl', function($scope, ApiV1Service){

	ApiV1Service.getUser().then((response) => {
		$scope.data = response.data;
	});
});
