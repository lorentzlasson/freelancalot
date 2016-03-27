app.controller('MainCtrl', ($scope, UserService) => {
	UserService.getMe()
	.then(response => {
		$scope.user = response.data
	})
	.catch(err => {
		console.error(err.data)
	})
})
