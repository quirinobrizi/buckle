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

const util = require('util');

const logger = require('../infrastructure/Logger');
const BuckleCompose = require('buckle-compose');

module.exports = class ContainerService {

    constructor(containerRepository) {
        this.containerRepository = containerRepository;
        this.buckleCompose = new BuckleCompose();
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
     * @param {string} the deployment type
     * @param {Array.<Any>} containers the containers to deploy
     */
    async deploy(type, containers) {
        if (type === 'compose') {
            return this._deployFromComposeDefinition(containers);
        } else {
            var answer = [];
            for (let container of containers) {
                logger.info("deploying container: %s", JSON.stringify(container));
                var deployed = await this.containerRepository.deploy(container.name, container.tag || 'latest', true, -1);
                answer.push({
                    name: container.name,
                    deployed: deployed
                });
            }
            return answer;
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

    _deployFromComposeDefinition(configurations) {
        logger.info("parse compose configurations %s", util.inspect(configurations));
        var answer = [];
        let configuration = this.buckleCompose.parse(configurations, {});
        logger.debug("parsed compose definition %s", util.inspect(configuration));
        if(configuration.network) {
            logger.info("creating networks if needed");
        }
        if(configuration.volumes) {
            logger.info("creating volumes if needed");
        }
        let order = this._defineDeploymentOrder(configuration);
        return answer;
    }

    _defineDeploymentOrder(configuration) {
        var answer = [];
        if(configuration.dependencies && configuration.dependencies.length > 0) {
            
        }
        return onswer;
    }
}
