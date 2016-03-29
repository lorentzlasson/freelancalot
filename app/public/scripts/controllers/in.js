app.controller('InCtrl', ($scope, Auth) => {
	$scope.logout = () => {
		Auth.logout()
	}
})
