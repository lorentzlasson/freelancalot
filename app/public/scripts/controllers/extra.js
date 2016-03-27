app.controller('ExtraCtrl', ($scope, UserService) => {
	UserService.getMyPhoto()
	.then(response => {
		$scope.photo = response.data
	})
	.catch(err => {
		console.error(err.data)
	})
})
