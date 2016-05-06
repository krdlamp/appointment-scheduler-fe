'use strict';

angular.module('scheduler')
    .controller('AppointmentCtrl', function($rootScope, $filter, $location, $route, $scope, Flash, Employee, Department, Appointment, Config, $uibModal) {
        var baseUrl = Config.apiBase + '/appointments';

        // Configure calendar object
        $scope.uiConfig = {
            calendar:{
                height: 800,
                editable: true,
                header:{
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                dayClick: $scope.alertEventOnClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                timeFormat: 'h:mm A',
                ignoreTimezone: false,
            }
        };

        var user = JSON.parse(window.localStorage.getItem('user'));
        $scope.user = user;

        $scope.eventSources = [];

        // Get authenticated user info from local storage and
        // convert it to JSON object
        // var user = JSON.parse(window.localStorage.getItem('user'));
        // $scope.user = user;

        // Get employees that haven't been selected
        Employee.all().then(function(resp) {
            $scope.employees = resp.data;
        });

        // Get all appointments
        Appointment.all().then(function (resp) {
            var appointments = resp.data;
            $scope.appointments = appointments;
            $scope.events = [];
            angular.forEach(appointments, function (value) {
                var meeting = {
                    title: value.subject,
                    date: value.set_date,
                    start: value.set_date + ' ' + value.start_time,
                    start_time: value.start_time,
                    end_time: value.end_time,
                    purpose: value.purpose,
                    url: '#/scheduler/appointment/' + value.id + '/details',
                    allDay: false
                }
                $scope.events.push(meeting);
            });
            $scope.eventSources.push($scope.events);
        });

        // Initialize agendas to an empty array
        $scope.agendas = [];

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

        // Set appointment
        $scope.schedule = function() {
            var data = [];

            data.subject     = $scope.subject;
            data.employees   = $scope.selectedEmps;
            data.set_date    = $filter('date')($scope.set_date, 'yyyy-MM-dd', 'UTC+08:00');
            data.start_time  = $filter('date')($scope.start_time, 'hh:mm a', 'UTC+08:00');
            data.end_time    = $filter('date')($scope.end_time, 'hh:mm a', 'UTC+08:00');
            data.set_by      = $scope.user.id;
            data.purpose     = $scope.purpose;
            data.agendas     = $scope.agendas;
            data.status      = 'Scheduled';

            if ($scope.appointments.length > 0) {
                var conflicts = [];
                angular.forEach($scope.appointments, function (value) {
                    if (value.set_date === data.set_date) {
                        var formatTime = function (time) {
                            var timeTokens = time.split(':');
                            return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
                        }
                        var formatted_start_time = formatTime(value.start_time);
                        var value_start_time = $filter('date')(formatted_start_time, 'hh:mm a', 'UTC+08:00');
                        var formatted_end_time = formatTime(value.end_time);
                        var value_end_time = $filter('date')(formatted_end_time, 'hh:mm a', 'UTC+08:00');
                        if (value_start_time === data.start_time) {
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
                    Appointment.create(data).then(function () {
                        $location.path('/calendar');
                    });
                }
            } else {
                Appointment.create(data).then(function () {
                    $location.path('/calendar');
                });
            }

        }

    })