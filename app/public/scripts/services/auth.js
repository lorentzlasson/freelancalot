app.factory('Auth', ($http) => {
    var root = '';
    var token;

    return {
        login: (credentials) => {
            return $http.post(root + '/login', credentials).then((response) => {
                token = response.data.token;
                return response;
            });
        },

        register: (credentials) => {
            return $http.post(root + '/register', credentials).then((response) => {
                return response;
            });
        },

        token: () => {
            return token;
        }
    }
});