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

module.exports = class ContainerService {
    constructor(containerRepository) {
        this.containerRepository = containerRepository;
    }

    get(containerId) {
        return this.containerRepository.get(containerId);
    }

    /**
     * Retrieves all containers
     */
    getAllContainers() {
        return this.containerRepository.getAll();
    }

    /**
     * Deploy containers
     * @param {Array.<Any>} containers the containers to deploy
     */
    async deploy(containers) {
        var answer = [];
        for (let container of containers) {
            logger.info("deploying container: %s", JSON.stringify(container));
            var deployed = await this.containerRepository.deploy(container.name, container.tag || 'latest', true, -1);
            answer.push({
                name: container.name,
                deployed: deployed
            });
        }
    }

    /**
     * Scale a container
     * @param {Object} container the container to deploy
     */
    scale(container) {
        return this.containerRepository.deploy(container.name, container.tag || 'latest', false, container.cardinality);
    }

    deleteContainer(containerId) {
        return this.containerRepository.deleteContainer(containerId);
    }
}