'use strict';

angular.module('scheduler')
    .controller('AppointmentDetailsCtrl', function(Appointment, Flash, Employee, Department, $rootScope, $scope, $routeParams, $filter, $uibModal, $location) {
        if (!$rootScope.authenticated) {
            $location.path('/login');
        }

        Appointment.all().then(function(resp) {
            $scope.appointments = resp.data;
        });

        Appointment.find($routeParams.apptId).then(function (resp) {

        var user = JSON.parse(window.localStorage.getItem('user'));
        $scope.user = user;

        var formatTime = function (time) {
            var timeTokens = time.split(':');
            return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
        }

        $scope.appointment = resp.data;
        $scope.formattedDate = new Date(resp.data.set_date);
        $scope.formattedStartTime = formatTime(resp.data.start_time);
        $scope.formattedEndTime = formatTime(resp.data.end_time);

        console.log($scope.appointment.venue);

        var oldDate = $filter('date')(resp.data.set_date, 'MMMM d, yyyy');
        var oldStartTime = $filter('date')($scope.formattedStartTime, 'HH:mm a');
        var oldEndTime = $filter('date')($scope.formattedEndTime, 'HH:mm a');

        $scope.date = $filter('date')($scope.formattedDate, 'MMMM d, yyyy', 'UTC+08:00');
        $scope.start = $filter('date')($scope.formattedStartTime, 'HH:mm a', 'UTC+08:00');
        $scope.end = $filter('date')($scope.formattedEndTime, 'HH:mm a', 'UTC+08:00');

        var agendas = JSON.stringify($scope.appointment.agendas);
        localStorage.setItem('agendas', agendas);
        $scope.agendas = JSON.parse(window.localStorage.getItem('agendas'));


        var selectedEmps = JSON.stringify($scope.appointment.employees);
        localStorage.setItem('selectedEmps', selectedEmps);
        $scope.selectedEmps = JSON.parse(window.localStorage.getItem('selectedEmps'));

        // var agendas = JSON.stringify($scope.appointment.agendas);
        // localStorage.setItem('agendas', agendas);
        // $scope.agendas = JSON.parse(window.localStorage.getItem('agendas'));

        Employee.all().then(function (resp) {
            var emps = resp.data;
            $scope.employees = emps;
            // angular.forEach(emps, function (value) {
            //     if (value.id === $scope.appointment.employee_id) {
            //         $scope.appointment.employee = value;
            //     }
            // });
        });

        // Initialize agendas to an empty array

        $scope.animationsEnabled = true;

        $scope.syncEmps = function() {
            var selectedEmps = JSON.stringify($scope.selectedEmps);
            localStorage.setItem('selectedEmps', selectedEmps);
            $scope.selectedEmps = JSON.parse(window.localStorage.getItem('selectedEmps'));
        }

        // var id = 1;

        $scope.addAgenda = function() {
            var description = $scope.agenda.description;
            $scope.agenda = {
                // 'id': id++,
                'description': description
            }
            var agendas = JSON.stringify($scope.agendas.concat($scope.agenda));
            localStorage.setItem('agendas', agendas);
            $scope.agendas = JSON.parse(window.localStorage.getItem('agendas'));
        }

        $scope.removeAgenda = function(index) {
            var agendas = JSON.parse(window.localStorage.getItem('agendas'));
            agendas.splice(index, 1);
            agendas = JSON.stringify(agendas);
            localStorage.setItem('agendas', agendas);
            $scope.agendas = JSON.parse(window.localStorage.getItem('agendas'));
        }

        // Set appointment
        $scope.update = function() {
            var data = [];

            data.id          = $scope.appointment.id;
            data.subject     = $scope.appointment.subject;
            data.employees   = $scope.selectedEmps.concat($scope.user);
            data.set_date    = $filter('date')($scope.formattedDate, 'yyyy-MM-dd', 'UTC+08:00');
            data.start_time  = $filter('date')($scope.formattedStartTime, 'HH:mm a', 'UTC+08:00');
            data.end_time    = $filter('date')($scope.formattedEndTime, 'HH:mm a', 'UTC+08:00');
            data.set_by      = $scope.appointment.employee_id;
            data.purpose     = $scope.appointment.purpose;
            data.agendas     = $scope.agendas;
            data.venue       = $scope.appointment.venue;
            data.invitation_status = 'Pending';

            console.log(data.employees);

            if ($scope.appointments.length > 0) {
                var conflicts = [];
                angular.forEach($scope.appointments, function (value) {
                    if (value.set_date === data.set_date) {
                        var formatTime = function (time) {
                            var timeTokens = time.split(':');
                            return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
                        }
                        var formatted_start_time = formatTime(value.start_time);
                        var value_start_time     = $filter('date')(formatted_start_time, 'HH:mm a', 'UTC+08:00');
                        var formatted_end_time   = formatTime(value.end_time);
                        var value_end_time       = $filter('date')(formatted_end_time, 'HH:mm a', 'UTC+08:00');
                        if ((value_start_time === data.start_time) && (value.id != data.id)) {
                            conflicts.push(value);
                        }
                        if ((data.start_time < value_end_time) && (value_start_time < data.start_time)) {
                            conflicts.push(value);
                        }
                        if ((data.end_time > value_start_time) && (data.end_time < value_end_time)) {
                            conflicts.push(value);
                        }
                    }
                });
                if (conflicts.length > 0) {
                    var message = 'Warning: Time not available!';
                    Flash.create('danger', message, 0, true);
                    console.log('Time not available');
                } else {
                    if ((oldStartTime != data.start_time) || (oldEndTime != data.end_time) || (oldDate != data.set_date)) {
                        data.status  = 'Re-Scheduled';
                    } else {
                        data.status = 'Scheduled';
                    }
                    console.log(data);
                    Appointment.patch(data).then(function () {
                        $location.path('/scheduler/appointment/' + $scope.appointment.id + '/details');
                    });
                }
            } else {
                if ((oldStartTime != data.start_time) || (oldEndTime != data.end_time) || (oldDate != data.set_date)) {
                    data.status  = 'Re-Scheduled';
                } else {
                    data.status = 'Scheduled';
                }
                console.log(data);
                Appointment.patch(data).then(function () {
                    $location.path('/scheduler/appointment/' + $scope.appointment.id + '/details');
                });
            }
        }
    })

});
