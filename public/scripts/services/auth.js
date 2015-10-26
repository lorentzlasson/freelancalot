app.factory('AuthService', ($http) => {
    var root = '';

    return {
        login: (credentials) => {
            var promise = $http.post(root + '/login', credentials).then((response) => {
                return response;
            });
            return promise;
        },

        register: (credentials) => {
            var promise = $http.post(root + '/register', credentials).then((response) => {
                return response;
            });
            return promise;
        }
    }
});