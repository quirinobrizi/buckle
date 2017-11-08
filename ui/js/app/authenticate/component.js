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

angular.module('authenticate').component('authenticate', {
    templateUrl : 'js/app/authenticate/template.html',
    controller : [ 'Identity', 'Token', '$location', function AuthenticateController(Identity, Token, $location) {
        var self = this;
        Token.clear();
        self.authenticate = function(credential) {
            Identity.token({}, {
                username : credential.username,
                password : credential.password
            }, function(resp, headers) {
                Token.set(resp.toJSON());
                $location.path('/dashboard');
            });
        };
    } ]
});