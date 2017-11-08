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

const apiHelper = require('./api/api-helper');
const logger = require('../infrastructure/Logger');

module.exports = class EnvironmentInterface {

    constructor(eventEmitter, environmentService, realizationTranslator) {
        this.eventEmitter = eventEmitter;
        this.environmentService = environmentService;
        this.realizationTranslator = realizationTranslator;
    }

    buildApis(router) {

        var self = this;

        router.get('/environment/info', function(req, res) {
            self.environmentService.queryInfo()
                .then(function(answer) {
                    // apiHelper.handleSuccess(self.eventEmitter, res, "System information lodaded", answer);
                    res.status(200).json(answer);
                }).catch(e => {
                    apiHelper.handleError(self.eventEmitter, e, req, res);
                });
        });
    }

    receive(stats) {
        if (logger.debug) {
            logger.debug('received new realization event %s', JSON.stringify(stats));
        }
        this.environmentService.evaluateRealization(this.realizationTranslator.translate(stats));
    }


    registerListener() {
        var self = this;
        logger.info("registering realization listener")
        this.eventEmitter.on('containers.realization.received', realization => {
            self.receive(realization);
        });
    }

};
