'use strict';

angular.module('scheduler')
    .service('Appointment', function (Config, $http, $auth) {
        var baseUrl = Config.apiBase + '/appointments';
        return {
            all: function () {
                return $http.get(baseUrl);
            },
            find: function (id) {
                return $http.get(baseUrl + '/' + id);
            },
            create: function (appointment) {
                return $http({
                    method: 'POST',
                    url: baseUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer' + $auth.getToken()
                    },
                    data: {
                        subject: appointment.subject,
                        set_date: appointment.set_date,
                        start_time: appointment.start_time,
                        end_time: appointment.end_time,
                        purpose: appointment.purpose,
                        employees: appointment.employees,
                        agendas: appointment.agendas,
                        status: appointment.status
                    }
                })
            }
        }
    });