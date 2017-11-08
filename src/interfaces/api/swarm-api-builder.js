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

const apiHelper = require('./api-helper');

module.exports = class SwarmApiBuilder {
    constructor(dockerEngineClient, dockerRegistryClient, eventEmitter) {
        this.dockerRegistryClient = dockerRegistryClient;
        this.dockerEngineClient = dockerEngineClient;
        this.eventEmitter = eventEmitter;
    }

    buildApis(router) {
        var self = this;

        router.get('/swarms', function(req, res) {
            self.dockerEngineClient.getSwarm().then(function(swarm) {
                apiHelper.handleSuccess(self.eventEmitter, res, "Swarm information lodaded", swarm);
            }).catch(e => {
                apiHelper.handleError(self.eventEmitter, e, req, res);
            });
        });
    }
};