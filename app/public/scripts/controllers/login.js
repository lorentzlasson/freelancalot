app.controller('LoginCtrl', ($scope, UserService) => {
	$scope.login = credentials => {
		UserService.login(credentials)
		.then(response => {
			$scope.data = response
		})
		.catch(err => {
			console.error(err.data)
		})
	}
})
