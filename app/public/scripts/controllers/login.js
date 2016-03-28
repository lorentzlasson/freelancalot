app.controller('LoginCtrl', ($scope, UserService) => {
	$scope.login = credentials => {
		UserService.login(credentials)
		.then(response => {
			console.log(response.data)
		})
		.catch(err => {
			console.error(err.data)
		})
	}
})
