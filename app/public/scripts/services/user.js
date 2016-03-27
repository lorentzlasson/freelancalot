app.factory('UserService', ($http, Auth) => {
	let base = '/api/user'
	let tokenRoute = path => {
		return route(path)+'?token='+Auth.getToken()
	}

	let route = path => {
		return base+path
	}

	return {
		register: credentials => {
			return $http.post(route('/'), credentials)
		},

		login: credentials => {
			return $http.post(route('/login'), credentials).then(response => {
				Auth.setToken(response.data.token)
				return response
			})
		},

		getHello: () => {
			return $http.get(tokenRoute('/hello'))
		},

		getMe: () => {
			return $http.get(tokenRoute('/me'))
		},

		getMyPhoto: () => {
			return $http.get(tokenRoute('/me/photo'))
		}
	}
})
