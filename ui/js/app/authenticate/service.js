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

angular.module('authenticate').factory('Identity', [ '$resource', function($resource) {
    return $resource('/buckle/rest/auth/token', {}, {
        token : {
            method : 'POST'
        },
        me : {
            method : 'GET',
            url : '/buckle/rest/me',
            cache : true
        }
    });
} ]).service('Token', [ 'localStorageService', function(localStorageService) {
    this.isAuthenticated = function() {
        var authentication = getItem('authentication');
        return authentication != null && authentication != undefined;
    };

    this.clear = function() {
        var authentication = localStorageService.remove('authentication');
        // Bus.emit('actio.authentication.cleared', authentication);
    };

    this.set = function(authentication) {
        localStorageService.set('authentication', authentication);
        // Bus.emit('actio.authentication.recorded', authentication);
    };

    this.get = function() {
        return getItem('authentication');
    };

    var getItem = function(key) {
        var authentication = localStorageService.get('authentication');
        if (null == authentication) {
            return null;
        }
        return authentication != null && authentication.expiryTime > new Date().getTime() ? authentication : null;
    };

} ]);