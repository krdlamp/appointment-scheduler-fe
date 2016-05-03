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
        'ui.select'
    ])
    .constant('Config', {
        apiBase: document.domain === 'localhost' ? '//localhost:8000/api' : '//api.scheduler.dev/api',
    })
    .config(function ($routeProvider, $httpProvider, $authProvider, $provide, Config) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $authProvider.loginUrl = Config.apiBase + '/authenticate';
        $authProvider.httpInterceptor = false;

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
            controllerAs: 'about'
        })
        .when('/scheduler', {
            templateUrl: 'views/scheduler.html',
            controller: 'AppointmentCtrl',
            controllerAs: 'appointment'
        })
        .otherwise({
            redirectTo: '/'
        });
    })


