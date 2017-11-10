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

/**
 * Manage services for containers realization.
 */
module.exports = class EnvironmentService {

    constructor(eventEmitter, anomalyService, environmentRepository) {
        this.eventEmitter = eventEmitter;
        this.anomalyService = anomalyService;
        this.environmentRepository = environmentRepository;

        this.containers = {};
    }

    deregisterContainer(container) {
        logger.info("* * remove [%s] [%s] from realization", container.getName(), container.getContainerId());
        delete this.containers[container.getContainerId()];
    }

    alreadyObserves(container) {
        return container.getContainerId() in this.containers;
    }

    close() {

    }

    removeOrphans(containers) {
        var self = this;

        function comparer(otherArray) {
            return function (current) {
                return otherArray.filter(function (other) {
                    return other.getContainerId() == current;
                }).length == 0;
            }
        }
        var orphans = Object.keys(self.containers).filter(comparer(containers));

        for (var i = 0; i < orphans.length; i++) {
            var orphan = orphans[i];
            delete self.containers[orphan];
        }
    }

    /**
     * Evaluate the received realization
     * @method evaluateRealization
     * @param  {Realization}            realization the received realization
     */
    async evaluateRealization(realization) {
        if (!this.containers[realization.getContainerId()] ||
            (Date.now() - this.containers[realization.getContainerId()].lastEvaluate) > 1000) {

            let environment = await this.environmentRepository.get();
            let containers = await environment.inspectRealizationsForAnomalies(realization, this.anomalyService);
            this.eventEmitter.emit('containers.updated', containers);
            this.containers[realization.getContainerId()] = {
                lastEvaluate: Date.now()
            };
        }
    }

    queryInfo() {
        return this.environmentRepository.queryInfo();
    }
};
