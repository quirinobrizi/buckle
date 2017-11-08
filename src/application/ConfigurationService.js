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

const logger = require('../infrastructure/Logger')

module.exports = class ConfigurationService {

    constructor(eventEmitter, containerRepository) {
        this.eventEmitter = eventEmitter;
        this.containerRepository = containerRepository;
    }

    /**
     * Observe a container status in the context of current runtime and adjust,
     * if needed, the internal parameters to optimize the complete environment.
     * 
     * @param {Container}
     *            the container to evaluate and reconfigure
     */
    configure(container) {
        if (!container.isRunningForAtLeastMinutes(2)) {
            return false;
        }
        if (this._shouldUpdate(container) && !this.operating) {
            this.operating = true;
            var config = container.buildLimitsConfiguration();
            if (logger.debug) {
                logger.debug("built configuration %s", JSON.stringify(config));
            }
            var answer = this.containerRepository.update(container.getContainerId(), config);
            this.operating = false;
            return answer;
        }
    }

    _shouldUpdate(container) {
        if (!container.anomalies) {
            return false;
        }
        return container.anomalies.some(function(el) {
            return 'cpu-throttled' != el.type;
        });
    }
}