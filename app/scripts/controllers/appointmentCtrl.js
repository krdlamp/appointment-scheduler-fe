'use strict';

angular.module('scheduler')
    .controller('AppointmentCtrl', function($rootScope, $filter, $location, $route, $scope, Employee, Department, Appointment, Config, $uibModal) {

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

        $scope.eventSources = [];

        // Get authenticated user info from local storage and
        // convert it to JSON object
        var user = JSON.parse(window.localStorage.getItem('user'));
        $scope.user = user;

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
                    start: value.set_date + ' ' + value.start_time,
                    url: '/',
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

        var id = 1;

        $scope.addAgenda = function() {
            var description = $scope.agenda.description;
            $scope.agenda = {
                'id': id++,
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
            data.purpose     = $scope.purpose;
            data.agendas     = $scope.agendas;
            data.status      = 'Scheduled';
            console.log(data.start_time);
            console.log(data.end_time);

            if ($scope.appointments > 0) {
                angular.forEach($scope.appointments, function (value) {
                    if (value.set_date === data.set_date) {
                        if (value.start_time >= data.start_time && value.end_time <= data.end_time) {
                            console.log('Time not available');
                        }
                        else {
                            Appointment.create(data).then(function () {
                                $location.path('/calendar');
                            });
                        }
                    }
                })
            } else {
                Appointment.create(data).then(function () {
                    $location.path('/calendar');
                });
            }

        }

    });