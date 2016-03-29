app.factory('Auth', ($http, $window) => {
	this.token

	function loadToken(){
		this.token = $window.localStorage['token']
		return this.token
	}

	function saveToken(token){
		this.token = token
		$window.localStorage['token'] = token
	}
	
	return {
		getToken: () => {
			if(!loadToken()) throw new Error('no token')
			return this.token
		},

		setToken: token => {
			saveToken(token)
		}
	}
})
