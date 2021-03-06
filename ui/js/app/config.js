/*******************************************************************************
 * Copyright [2017] [Quirino Brizi (quirino.brizi@gmail.com)]
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

'use strict'

angular.module('buckle').config(
    ['$locationProvider', '$routeProvider', 'growlProvider',
        function config($locationProvider, $routeProvider, growlProvider) {
            growlProvider.globalTimeToLive(5000);
            $locationProvider.hashPrefix('!');
            $routeProvider
                .when('/dashboard', { template: '<dashboard></dashboard>' })
                .when('/clusters', { template: '<clusters></clusters>' })
                .when('/authenticate', { template: '<authenticate></authenticate>'})
                .when('/networks', { template: '<networks></networks>' })
                .when('/statistics', { template: '<statistics></statistics>' })
                .otherwise('/authenticate');
        }
    ]).run(['Notify', 'growl', 'Bus', function(Notify, growl, Bus) {
    Bus.listen('general.error', function(e, msg) {
        let data = typeof msg === 'string' ? JSON.parse(msg) : msg;
        let notification = data.error ? data.error.message || "Unknown Error Detected" :
            data.message ? data.message : JSON.stringify(msg)
        growl.error(notification);
    });

    Notify.connect('/buckle/socket.io', function() {
        Notify.subscribe('/topic/events', function(event) {
            if (!event.type) {
                if (event.message) {
                    growl.info(event.message);
                }
            } else {
                Bus.emit(event.type, event.payload);
            }
        });
    });
}]).service('TransactionInterceptor', ['$q', '$location', 'Token', 'Bus', function($q, $location, Token, Bus) {
    this.request = function(config) {
        if ('/authenticate' !== $location.path()) {
            if (Token.isAuthenticated()) {
                var token = Token.get();
                config.headers['Authorization'] = token.type + " " + token.token;
            } else {
                Token.clear();
                $location.path('/login');
            }
        }
        return config;
    };
    this.responseError = function(response) {
        if (response.status === 401 || response.status === 403) {
            if ('/authenticate' === $location.path()) {
                Token.clear();
                $location.path('/login');
                return $q.reject(response);
            } else {
                return Bus.emit('general.error', {
                    error: 'Login failed for ' + $location.path()
                });
            }
        } else if (response.status === 400 || response.status > 403) {
            // Bus.emit('actio.runtime.error', response);
            return $q.reject(response);
        }
        return $q.reject(response);
    };
    this.response = function(response) {
        return response || $q.when(response);
    };
}]).config(['$httpProvider', 'localStorageServiceProvider', function($httpProvider, localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('buckle');
    $httpProvider.interceptors.push('TransactionInterceptor');
}]);
