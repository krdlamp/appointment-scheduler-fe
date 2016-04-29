'use strict';

angular.module('scheduler')
    .controller('AppointmentCtrl', function($scope, Employee, Department) {
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
        
        Employee.all().then(function(resp) {
            $scope.employees = resp.data;
        });
        
        Department.all().then(function(resp) {
            $scope.departments = resp.data;
        });

        $scope.eventSources = [
            {
                title: 'Event1',
                start: '2016-04-04'
            }
        ];

        $scope.selectedEmployees = [];
        $scope.agendas = [];
        
        $scope.schedule = function() {
            
        }
        
    })