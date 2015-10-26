app.factory('ApiV1Service', ($http) => {
	var root = '/api/v1';
	return {
		getHello: () => {
			var promise = $http.get(root+'/hello').then((response)=>{
				return response;
			});
			return promise;
		},

		getUser: () => {
			var promise = $http.get(root+'/user').then((response)=>{
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