'use strict';

angular.module('scheduler')
    .service('Employee', function(Config, $http) {
        var baseUrl = Config.apiBase + '/employees';
        return {
            all: function() {
                return $http.get(baseUrl);
            }
        }
    });