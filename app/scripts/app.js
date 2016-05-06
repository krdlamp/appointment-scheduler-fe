'use strict';

/**
 * @ngdoc overview
 * @name scheduler
 * @description
 * # scheduler
 *
 * Main module of the application.
 */
angular
    .module('scheduler', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.calendar',
        'ui.router',
        'satellizer',
        'ui.bootstrap',
        'ui.select',
        'ngFlash'
    ])
    .constant('Config', {
        apiBase: document.domain === 'localhost' ? '//localhost:8000/api' : '//api.scheduler.dev/api',
    })
    .config(function ($routeProvider, $httpProvider, $authProvider, $provide, Config, FlashProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $authProvider.loginUrl = Config.apiBase + '/authenticate';
        $authProvider.httpInterceptor = false;
        FlashProvider.setTimeout(5000);
        FlashProvider.setShowClose(true);

            $routeProvider
                .when('/', {
                    templateUrl: 'views/calendar.html',
                    controller: 'AppointmentCtrl',
                    controllerAs: 'appointment'
                })
                .when('/login', {
                    templateUrl: 'views/auth.html',
                    controller: 'AuthCtrl',
                    controllerAs: 'auth'
                })
                .when('/about', {
                    templateUrl: 'views/about.html',
                    controller: 'AboutCtrl',
                    controllerAs: 'about',

                })
                .when('/scheduler', {
                    templateUrl: 'views/scheduler.html',
                    controller: 'AppointmentCtrl',
                    controllerAs: 'appointment',

                })
                .when('/scheduler/appointment/:apptId/details', {
                    templateUrl: 'views/appointmentDetails.html',
                    controller: 'AppointmentDetailsCtrl',
                    controllerAs: 'appointment-details'
                })
                .when('/scheduler/appointment/:apptId/edit', {
                    templateUrl: 'views/editAppointment.html',
                    controller: 'AppointmentDetailsCtrl',
                    controllerAs: 'appointment-details'
                })
                .otherwise({
                    redirectTo: '/'
                });
    })
   


