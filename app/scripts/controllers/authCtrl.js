'use strict';

angular.module('scheduler')
    .controller('AuthCtrl', function($auth, $route, $scope) {
        $scope.loginData = {
            emp_num: '',
            password: ''
        };

        $scope.login = function() {
            var credentials = {
                emp_num: $scope.loginData.emp_num,
                password: $scope.loginData.password
            }

            // Auth.login(credentials).then(function(data) {
            //     window.localStorage.token = data.token;
            //     $route.redirectTo('/');
            // })

            $auth.login(credentials).then(function(data) {
                $route.redirectTo('/');
            })
        }
    });