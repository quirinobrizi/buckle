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

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const util = require('util');

const authenticationHelper = require('./AuthenticationHelper');
const logger = require('../Logger');

module.exports = class AuthenticatioStrategyFactory {
    /**
     * Create a new AuthenticatioStrategyFactory instance
     * 
     * @method constructor
     * @param {Object}
     *            opts the options for creating a valid strategy
     * @return {AuthenticatioStrategyFactory} the AuthenticatioStrategyFactory
     */
    constructor(opts, router) {
        this.opts = opts;
        this.router = router;
        router.use(passport.initialize());
    }

    /**
     * Initialize the requested strategy type.
     * 
     * @return {object} the initialized strategy
     * @throws Error
     *             if the requested strategy is not supported
     */
    getStrategy() {
        logger.debug("creating requested local strategy");
        passport.use(this._local(this.opts, this.userRepository));
        return passport.authenticate('local', {
            session: false
        });
    }

    _local(opts) {
        return new LocalStrategy({
                passReqToCallback: false
            },
            (username, password, done) => {
                authenticationHelper[opts.verifier.type](opts.verifier, username, password, function(err, token) {
                    if(err) {
                        return done(err, null);
                    }
                    if(opts.user.profile.retrieve) {
                        const request = require('request');
                        var _opts = {
                            rejectUnauthorized: false,
                            url: util.format('%s/%s', opts.user.profile.uri, username.replace(/\n$/, '')),
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': util.format('Bearer %s', token["access_token"]),
                                'Referer': opts.user.profile.referer || ""
                            }
                        };
                        request(_opts, function(e, r, b) {
                            var statusCode = r ? r.statusCode || 500 : 500;
                            logger.info("get profile response code [%s]", statusCode);
                            if (!e && statusCode == 200) {
                                done(null, {
                                    token: token,
                                    username: username,
                                    firstName: b[opts.user.profile.firstName || 'firstName'],
                                    lastName: b[opts.user.profile.lastName || 'lastName'],
                                    picture: b[opts.user.profile.picture || 'picture']
                                });
                            } else {
                                logger.error("get profile error [%j] - [%j]", e, b);
                                done(null, {
                                    token: token,
                                    username: username
                                });
                            }
                        });
                    } else {
                        done(null, {
                            token: token,
                            username: username
                        });
                    }
                });
            });
    }
};