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

const ScaleContainerAdaptor = require('../../infrastructure/adaptor/ScaleContainerAdaptor');
const logger = require('../../infrastructure/Logger');

module.exports = class ContainerRepository {

    constructor(dockerEngineClient, containerTranslator) {
        this.dockerEngineClient = dockerEngineClient;
        this.containerTranslator = containerTranslator;
        // store augmented container information in memory...
        this.containers = [];
    }

    /**
     * Queries information about a container specified via its id and return a
     * container.
     */
    async get(containerId) {
        var container = await this.dockerEngineClient.inspectContainer(containerId);
        var answer = this.containerTranslator.translate(container);
        if (answer.getContainerId() in this.containers) {
            var storedContainer = this.containers[answer.getContainerId()];
            answer.setRealization(storedContainer.realization);
            answer.setAnomalies(storedContainer.anomalies);
            answer.setLastUpdate(storedContainer.lastUpdate);
        }
        return answer;
    }

    async getAll() {
        var answer = [];
        var containers = await this.dockerEngineClient.listContainers();
        for (var i = 0; i < containers.length; i++) {
            var container = this.containerTranslator.translate(containers[i]);
            if (container.getContainerId() in this.containers) {
                container.setRealization(this.containers[container.getContainerId()].realization);
                container.setAnomalies(this.containers[container.getContainerId()].anomalies);
                container.setLastUpdate(this.containers[container.getContainerId()].lastUpdate);
            }
            answer.push(container);
        }
        return answer;
    }

    /**
     * Save a container
     * @param  {[Container} container the container to save
     */
    save(container) {
        var _container = this.containers[container.getContainerId()] || {
            realization: [],
            anomalies: []
        };
        _container.realization = container.getRealizations();
        _container.anomalies = container.getAnomalies();
        _container.lastUpdate = container.getLastUpdate();

        this.containers[container.getContainerId()] = _container;
    }

    registerRealizationListener(containerId, success, failure) {
        this.dockerEngineClient.containerRealization(containerId, success, failure);
    }

    update(containerId, config) {
        return this.dockerEngineClient.updateContainer(containerId, config);
    }

    deleteContainer(containerId) {
        return this.dockerEngineClient.deleteContainer(containerId);
    }

    /**
     * Deploy a container.
     * @param {string} name the name of the container to deploy
     * @param {string} tag  the version the container should be deployed at
     * @param {boolean} recreate a flag indicating if already running containers should be recreated
     * @param {number} cardinality the number of conatainers to deploy, if 0 or -1 the cardinality will be set as the currently running containers.
     */
    async deploy(name, tag, recreate, cardinality) {
        try {
            logger.info("deploying container %s at version %s with cardinality %s", name, tag, cardinality);
            var containers = await this.dockerEngineClient.getContainersByName(name);
            var containerInfo = await this.dockerEngineClient.inspectContainer(containers[0].Id);
            var image = /([^:]*):?(.*)$/g.exec(this._extractImage(containerInfo))[1];
            var config = new ScaleContainerAdaptor().adapt(containerInfo, util.format("%s:%s", image, tag), name);
            var startBeforeDelete = this._hasHostExposedPorts(containerInfo);
            var targetCardinality = cardinality == -1 || cardinality == 0 ? containers.length : cardinality;
            logger.info("pulling image %s", image);
            var pull = await this.dockerEngineClient.pullImage(image, tag);
            if (logger.debug) {
                logger.debug("pull response %s", JSON.stringify(pull));
            }
            var scale = await this.dockerEngineClient.deployOrScaleContainer(config, name, image, targetCardinality, recreate, startBeforeDelete);
            if (logger.debug) {
                logger.debug("scale response %s", JSON.stringify(scale));
            }
            logger.info("container %s deployed at version %s with cardinality %s", name, tag, targetCardinality);
            return true;
        } catch (e) {
            console.log(e.stack);
            logger.error("unable to deploy requested container %s", e);
            return false;
        }
    }

    _extractImage(container) {
        if(container.Image.startsWith("sha256")) {
            return container.Config.Image;
        }
        return container.Image
    }

    _hasHostExposedPorts(container) {
        var bindings = container.HostConfig.PortBindings;
        if (bindings) {
            console.log("Port bindings available for container [%s]", container.Id);
            Object.keys(bindings).forEach(key => {
                bindings[key].forEach(b => {
                    if (b.HostPort) {
                        console.log("container [%s] has at least one port exposed on the host [%s]", container.Id, b.HostPort);
                        return true;
                    }
                })
            })
        }
        return false;
    }
}
