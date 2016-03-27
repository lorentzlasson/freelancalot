app.factory('Auth', ($http) => {
	this.token
	
	return {
		getToken: () => {
			if(!this.token) throw new Error('no token')
			return this.token
		},

		setToken: token => {
			this.token = token
		}
	}
})
