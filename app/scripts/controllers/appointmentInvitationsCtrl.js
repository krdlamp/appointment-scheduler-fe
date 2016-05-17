'use strict';

angular.module('scheduler')
    .controller('AppointmentInvitationsCtrl', function($scope, $rootScope, Appointment, AppointmentStatus, PersonnelAppointment, Employee, $location) {
      if (!$rootScope.authenticated) {
          $location.path('/login');
      }

        var currentUser = JSON.parse(window.localStorage.getItem('user'));

        $scope.pendingInvitations    = [];
        $scope.approvedAppointments  = [];
        $scope.cancelledAppointments = [];
        $scope.scheduledAppointments = [];
        $scope.requests              = [];

        $scope.formatTime = function (time) {
            var timeTokens = time.split(':');
            return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
        };

        Appointment.all().then(function (resp) {
            var appointments = resp.data;
            angular.forEach(appointments, function (value) {
                if (value.employee_id === currentUser.id) {
                    $scope.requests.push(value);
                }
            });
            $scope.requestsCount  = $scope.requests.length;
        });

        PersonnelAppointment.getEmpAppointment(currentUser.id).then(function(resp) {
          var appointments = resp.data;
          angular.forEach(appointments, function(value) {
            console.log(value);
            if (value.employee_id !== currentUser.id) {
              if (value.pivot.status === "") {
                $scope.pendingInvitations.push(value);
              } else if (value.pivot.status === "Attendance Confirmed") {
                $scope.approvedAppointments.push(value);
              }
            }
          });
          $scope.pendingCount   = $scope.pendingInvitations.length;
          $scope.approvedCount  = $scope.approvedAppointments.length;
        });

        Appointment.all().then(function (resp) {
            var allSched = [];
            var appointments = resp.data;
            angular.forEach(appointments, function(value) {
              var trues = [];
              var appointment = value;
              var emps = appointment.employees;
              angular.forEach(appointment.employees, function(value) {
                // if(value.pivot.status === "Attendance Confirmed") {
                if((value.pivot.status === "Attendance Confirmed") || ((value.pivot.status === "") && (value.employeeId === value.pivot.employee_id))) {
                  trues.push(value);
                }
              });
              if(emps.length === trues.length + 1) {
                allSched.push(appointment);
              }
            });
            angular.forEach(allSched, function(value) {
              var appt = value;
              angular.forEach(appt.employees, function(value) {
                if(value.id === currentUser.id) {
                  $scope.scheduledAppointments.push(appt);
                }
              });
            });
            $scope.scheduledCount = $scope.scheduledAppointments.length;
        });


        $scope.getEmp = function(empId) {
          Employee.all().then(function (resp) {
            var emps = resp.data;
            angular.forEach(emps, function(value) {
              if (value.id === empId) {
                $scope.employee = value;
              }
            });
          });
        };

        $scope.cancelledCount = $scope.cancelledAppointments.length;

        $scope.confirmAttendance = function(appointment) {
            var data = [];

            data.appointment_id = appointment.id;
            data.employee_id    = currentUser.id;
            data.status         = 'Attendance Confirmed';

            AppointmentStatus.update(data).then(function () {
                $location.path('/scheduler/appointments/my-appointments');
            });
        };
    });
