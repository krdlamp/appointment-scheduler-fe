'use strict';

angular.module('scheduler')
    .controller('AppointmentListCtrl', function ($scope, $filter, $rootScope, Appointment, Employee) {
        if (!$rootScope.authenticated) {
            location.path('/login');
        }
        
        $scope.currentDate = new Date;

        $scope.formatTime = function (time) {
            var timeTokens = time.split(':');
            return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
        }

        $scope.getEmp = function(emp_id) {
            Employee.all().then(function (resp) {
                var emps = resp.data;
                angular.forEach(emps, function (value) {
                    if (value.id === emp_id) {
                        $scope.set_by = value;
                    }
                });
            });
        }

        Appointment.all().then(function (resp) {
            $scope.appointments = resp.data;
        })
    })