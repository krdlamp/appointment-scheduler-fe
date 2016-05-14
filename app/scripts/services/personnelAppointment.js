'use strict';

angular.module('scheduler')
  .service('PersonnelAppointment', function(Config, $http, $auth) {
    var currentUser = JSON.parse(window.localStorage.getItem('user'));
    var baseUrl = Config.apiBase + '/personnel-appointments/' + currentUser.id;
    return {
      all: function() {
        return $http.get(baseUrl);
      }
    }
  })
