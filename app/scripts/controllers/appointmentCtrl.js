'use strict';

angular.module('scheduler')
    .controller('AppointmentCtrl', function($rootScope, $scope, Employee, Department, $uibmodal) {
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

        // Get all employees
        Employee.all().then(function(resp) {
            $scope.employees = resp.data;
        });

        // Get all departments
        Department.all().then(function(resp) {
            $scope.departments = resp.data;
        });

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

        // Initialize selected employees to an empty array
        $scope.selectedEmps = [];

        // Initialize agendas to an empty array
        $scope.agendas = [];

        // Set appointment
        $scope.schedule = function() {
            
        }

        $scope.animationsEnabled = true;

        // Open modal for adding an employee
        $scope.open = function(size) {
            // Initialize a modal instance
            var modalInstance = $uibmodal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/employeeModal.html',
                controller: 'AppointmentCtrl',
                size: size,
                resolve: {
                    employees: function () {
                        return $scope.employees;
                    }
                }
            });


            modalInstance.result.then(function (selectedEmp) {
                $scope.selectedEmps.push(selectedEmp);
            })
        }
        
    })