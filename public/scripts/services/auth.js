app.factory('AuthService', ($http) => {
    var root = '';

    var currentUser;

    return {
        login: (credentials) => {
            var promise = $http.post(root + '/login', credentials).then((response) => {
                currentUser = response.data;
                return response;
            });
            return promise;
        },

        register: (credentials) => {
            var promise = $http.post(root + '/register', credentials).then((response) => {
                return response;
            });
            return promise;
        },

        authorized: (permission) => {
            var isAuthorized = false;
            if (currentUser) {
                switch (permission) {
                    case 'authenticated':
                    isAuthorized =  true;
                    break;

                    case 'admin':
                    isAuthorized = currentUser.permission === 'admin';
                    break;
                }
            };
            return isAuthorized;
        },

        loadCurrentUser: () => {
            $http.get('/user').then((response) => {
                currentUser = response.data;
            })
        }
    }
});