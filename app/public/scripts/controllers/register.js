app.controller('RegisterCtrl', ($scope, UserService) => {
	$scope.register = (credentials) => {
		UserService.register(credentials)
		.then(response => {
			$scope.data = response.data
		})
		.catch(err => {
			console.error(err.data)
		})
	}
})
