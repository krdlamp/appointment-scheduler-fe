'use strict';

angular.module('scheduler')
    .controller('AppointmentInvitationsCtrl', function($scope, Appointment, AppointmentStatus, PersonnelAppointment, Employee, $location) {

        var currentUser = JSON.parse(window.localStorage.getItem('user'));

        $scope.invitations = [];
        $scope.pendingInvitations = [];
        $scope.approvedAppointments = [];
        $scope.requests = [];

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
            var appointments = resp.data;
            angular.forEach(appointments, function (value) {
                if(value.employee_id != currentUser.id) {
                    $scope.invitations.push(value);
                } else if (value.employee_id === currentUser.id) {
                    $scope.requests.push(value);
                }
            })
        });

        PersonnelAppointment.all().then(function(resp) {
          var appointments = resp.data;
          console.log(appointments);
          angular.forEach(appointments, function(value) {
            if (value.pivot.status === "" && value.employee_id != currentUser.id) {
              $scope.pendingInvitations.push(value);
            } else if (value.pivot.status === "Attendance Confirmed") {
              $scope.approvedAppointments.push(value);
            }
          })
        });

        $scope.confirmAttendance = function(appointment) {
            var data = [];

            data.appointment_id = appointment.id;
            data.employee_id    = currentUser.id;
            data.status         = 'Attendance Confirmed';

            AppointmentStatus.update(data).then(function () {
                $location.path('/scheduler/appointments/my-appointments');
            })
        }
    })
