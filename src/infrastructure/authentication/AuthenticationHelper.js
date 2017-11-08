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

"use strict"

const util = require('util');

module.exports = {

    local: function(options, username, password, done) {
        var challenges = options.db.split(',');
        if (challenges.indexOf(util.format("%s:%s", username, password)) > -1) {
            console.log("***** found valid user");
            done(null, true);
        } else {
            console.error("invalid credential");
            done({
                message: "invalid authentication credential",
                error: null
            }, null);
        }
    },

    oauth2: function(options, username, password, done) {
        var ClientOAuth2 = require('client-oauth2');
        var client = new ClientOAuth2({
            clientId: options.client.id,
            clientSecret: options.client.secret,
            accessTokenUri: options.accessTokenUri,
            scopes: options.scopes,
            headers: {
                'Content-Type': options.contentType
            }
        });
        client.owner.getToken(username, password)
            .then(resp => {
                done(null, resp.data);
            })
            .catch(e => {
                done(e, null);
            });
    }
};