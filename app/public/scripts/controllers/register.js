app.controller('RegisterCtrl', ($scope, UserService) => {
	$scope.register = (credentials) => {
		UserService.register(credentials)
		.then(response => {
			console.log(response.data)
		})
		.catch(err => {
			console.error(err.data)
		})
	}
})
