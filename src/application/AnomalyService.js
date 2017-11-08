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


const logger = require('../infrastructure/Logger');

module.exports = class AnomalyService {
    constructor(eventEmitter, anomalyAnalyzer) {
        this.eventEmitter = eventEmitter;
        this.anomalyAnalyzer = anomalyAnalyzer;
    }

    /**
     * Process anomalies for a container
     * @param {Container} container 
     */
    process(container) {
        var self = this;
        if (!container) {
            logger.error("container has not been provided");
            return;
        }
        if (logger.debug) {
            logger.debug("analyze anomalies for container %s", JSON.stringify(container));
        }
        if (!container.isRunningForAtLeastMinutes(2)) {
            return;
        }
        return self.anomalyAnalyzer.analyze({
            container: container
        });
        // self.containerRepository.save(container);
        // logger.debug("detected %s anomalies on container %s", anomalies.length, container.getName());
        // return anomalies;
        // if (anomalies && anomalies.length > 0) {
        //     self.eventEmitter.emit('container.anomalies.detected', container);
        //     self.configurationService.configure(container);
        // }
    }
}