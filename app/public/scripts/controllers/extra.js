app.controller('ExtraCtrl', function($scope, ApiV1Service){

	ApiV1Service.getUserPhoto().then((response) => {
		$scope.photo = response.data;
	});
});
