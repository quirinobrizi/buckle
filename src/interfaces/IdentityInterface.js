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

const jwt = require('jsonwebtoken');
const AuthenticatioStrategyFactory = require('../infrastructure/authentication/AuthenticationStrategyFactory');

module.exports = class IndentityApiBuilder {
    constructor(configuration, userRepository) {
        this.configuration = configuration;
        this.userRepository = userRepository;
    }

    buildApis(router, authentication) {
        var self = this;

        var authenticationType = this.configuration.buckle.authentication.type;
        var authentication = new AuthenticatioStrategyFactory(this.configuration.buckle.authentication, router).getStrategy(authenticationType);

        router.post('/auth/token', authentication, (req, res) => {
            this.userRepository.save(req.user);
            var expiry = Date.now() + 2 * 60 * 60 * 1000;
            var token = jwt.sign({
                exp: expiry,
                iat: Date.now(),
                iss: 'buckle',
                aud: 'buckle-api',
                sub: req.user.username
            }, this.configuration.buckle.authentication.jwt.secret);
            res.status(200).json({
                type: 'Bearer',
                token: token,
                expiryTime: expiry
            })
        });
        
        router.get("/me", (req, res) => {
            var user = this.userRepository.get(req.user.sub);
            res.status(200).json({
                username: user.username
            });
        });
    }
};