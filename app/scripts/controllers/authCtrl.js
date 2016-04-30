'use strict';

angular.module('scheduler')
    .controller('AuthCtrl', function($auth, $route, $scope, $location, Config, $http, $rootScope) {
        var baseUrl = Config.apiBase  + '/authenticate/user'
        $scope.loginData = {
            emp_num: '',
            password: ''
        };

        $scope.loginError = false;
        $scope.loginErrorText;

        $scope.login = function() {
            var credentials = {
                emp_num: $scope.loginData.emp_num,
                password: $scope.loginData.password
            }

            // Auth.login(credentials).then(function(data) {
            //     window.localStorage.token = data.token;
            //     $route.redirectTo('/');
            // })

            $auth.login(credentials).then(function() {

                // Return an $http request for the now authenticated user
                return $http({
                    method: 'GET',
                    url: baseUrl,
                    headers: {
                        Authorization: 'Bearer' + $auth.getToken()
                    }
                }).then(function (response) {

                    // Stringify the returned data to prepare it
                    // to go into local storage
                    var user = JSON.stringify(response.data.user);

                    // Set the stringified user data into local storage
                    localStorage.setItem('user', user);

                    // The user's authenticated state gets flipped to
                    // true so we can now show parts of the UI that rely
                    // on the user being logged in
                    $rootScope.authenticated = true;

                    // Putting the user's data on $rootScope allows
                    // us to access it anywhere across the app
                    $rootScope.currentUser = response.data.user;

                    $location.path('/');
                    window.alert('You are now logged in!');
                });

            // Handle errors
            }, function(error) {
                $scope.loginError = true;
                $scope.loginErrorText = error.data.error;

            });
        }

        $rootScope.logout = function() {
            $auth.logout().then(function() {
                localStorage.removeItem('user');

                $rootScope.authenticated = false;

                $rootScope.currentUser = null;
            })
        }
    });