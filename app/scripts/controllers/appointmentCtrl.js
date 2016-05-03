'use strict';

angular.module('scheduler')
    .controller('AppointmentCtrl', function($rootScope, $location, $route, $scope, Employee, Department, Appointment, $uibModal) {
        // Configure calendar object
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: true,
                header:{
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                dayClick: $scope.alertEventOnClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize
            }
        };

        // Get authenticated user info from local storage and
        // convert it to JSON object
        var user = JSON.parse(window.localStorage.getItem('user'));
        $scope.user = user;

        // Get all appointments
        $scope.eventSources = [
            {
                title: 'Event1',
                start: '2016-04-04'
            }
        ];
        
        
        // Get employees that haven't been selected
        Employee.all().then(function(resp) {
            $scope.employees = resp.data;
        });

        // Initialize agendas to an empty array
        $scope.agendas = [];

        $scope.animationsEnabled = true;

        // Open modal for adding an employee <Junk>
        // $scope.open = function(size) {
        //     // Initialize a modal instance
        //     var modalInstance = $uibModal.open({
        //         animation: $scope.animationsEnabled,
        //         templateUrl: 'views/employeeModal.html',
        //         controller: 'AppointmentCtrl',
        //         size: size,
        //         resolve: {
        //             employees: function () {
        //                 return $scope.employees;
        //             }
        //         }
        //     });
        //
        //
        //     modalInstance.result.then(function () {
        //         $route.reload();
        //     })
        // }

        // $scope.cancelEmpModal = function() {
        //     $uibModalInstance.dismiss('cancel');
        // };
        
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

            data.employees   = $scope.selectedEmps;
            data.set_date    = $scope.set_date;
            data.start_time  = $scope.start_time.toLocaleTimeString();
            data.end_time    = $scope.end_time.toLocaleTimeString();
            data.purpose     = $scope.purpose;
            data.agendas     = $scope.agendas;
            data.status      = 'Scheduled';
            
            Appointment.create(data).then(function () {
                $location.path('/calendar');
            });
        }
    });