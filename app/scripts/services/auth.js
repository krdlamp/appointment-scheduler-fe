'use strict';


angular.module('scheduler')
    .service('Auth', function(Config, $http) {
        var baseUrl = Config.apiBase + '/authenticate';
        return {
            login: function(cred) {
                return $http({
                    method: 'POST',
                    url: baseUrl,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        emp_num: cred.emp_num,
                        password: cred.password
                    }
                });
            }
        };
    });
