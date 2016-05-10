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
        'ngStorage',
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
        $authProvider.httpInterceptor = true;
        // $authProvider.httpInterceptor = false;
        FlashProvider.setShowClose(true);

            $routeProvider
                .when('/', {
                    templateUrl: 'views/calendar.html',
                    controller: 'AppointmentCtrl',
                    controllerAs: 'appointment',
                })
                .when('/login', {
                    templateUrl: 'views/auth.html',
                    controller: 'AuthCtrl',
                    controllerAs: 'auth',
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
                    controllerAs: 'appointment-details',
                })
                .when('/scheduler/appointment/:apptId/edit', {
                    templateUrl: 'views/editAppointment.html',
                    controller: 'AppointmentDetailsCtrl',
                    controllerAs: 'appointment-details',
                })
                .when('/scheduler/appointments', {
                    templateUrl: 'views/appointments.html',
                    controller: 'AppointmentListCtrl',
                })
                .when('/scheduler/appointments/my-appointments', {
                    templateUrl: 'views/myappointments.html',
                    controller: 'AppointmentInvitationsCtrl'
                })
                .otherwise({
                    redirectTo: '/',
                })

        $httpProvider.interceptors.push(function(Flash, $q, $rootScope, $location, $localStorage, $window) {
            return {
                'request': function(config) {
                    config.headers = config.headers || {};
                    var token = localStorage.getItem('satellizer_token');
                    if (token) {
                        config.headers.Authorization = 'Bearer ' + token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if (response.status === 401 || response.status === 403 || response.status === 400) {
                        localStorage.removeItem('satellizer_token');
                        localStorage.removeItem('user');
                        $rootScope.authenticated = false;
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        });
    })
    .run(function($rootScope, $auth, $location, $route) {
        $rootScope.$on('$locationChangeStart', function () {
            if ($rootScope.authenticated === undefined) {
                var token = localStorage.getItem('satellizer_token');
                if (token) {
                    $rootScope.authenticated = true;
                    $route.reload();
                } else {
                    $rootScope.authenticated = false;
                    $location.path('/login');
                }
            }
        });
    })
   


