app.factory('ApiV1Service', ($http, Auth) => {
	var root = '/api/v1';
	return {
		getHello: () => {
			var promise = $http.get(root+'/hello').then((response)=>{
				return response;
			});
			return promise;
		},

		getUser: () => {
			var token = Auth.token();
			var promise = $http.get(root+'/user?token='+token).then((response)=>{
				return response;
			});
			return promise;
		},

		getUserPhoto: () => {
			var promise = $http.get(root+'/user/photo').then((response)=>{
				return response;
			});
			return promise;
		}
	}
});