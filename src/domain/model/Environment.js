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
const AsyncLock = require('async-lock');

const logger = require('../../infrastructure/Logger');

/**
 * A.R. describe the environment nnodes and containers live on.
 * @type {Environment}
 */
module.exports = class Environment {

    /**
     * Create a new environemnt instance
     * @method constructor
     * @param  {string}    name    The environment name
     * @param  {string}    version The environment version
     * @return {Environment}       The new instance
     */
    constructor(name) {
        this.name = name;
        this.nodes = new Map();

        this.containers = new Map();

        this.numberOfContainers = 0;
        this.numberOfRunningContainers = 0;
        this.numberOfStoppedContainers = 0;
        this.numberOfPausedContainers = 0;

        this.numberOfNodes = 0;
        this.numberOfManagers = 0;

        this.serverVersion = "";
        this.architecture = "";
        this.osType = "";
        this.operatingSystem = "";
        this.kernelVersion = ""

        this.containerRepository = null;
        this.lock = new AsyncLock();
    }

    getName() {
        return this.name;
    }

    getVersion() {
        return this.serverVersion;
    }

    /**
     * Allows to set the number of containers deployed on this environment in a fluent style
     * @method setNumberOfContainers
     * @param  {number}              numberOfContainers the number of containers
     * @return {Environment}    this instance
     */
    setNumberOfContainers(numberOfContainers) {
        this.numberOfContainers = numberOfContainers;
        return this;
    }

    /**
     * Allows retrieve the number of containers deployed on this environment
     * @method getNumberOfContainers
     * @return {number}              the number of containers
     */
    getNumberOfContainers() {
        return this.numberOfContainers;
    }

    /**
     * Allows to set the number of running containers deployed on this environment in a fluent style
     * @method setNumberOfRunningContainers
     * @param  {number}              numberOfRunningContainers the number of running containers
     * @return {Environment}    this instance
     */
    setNumberOfRunningContainers(numberOfRunningContainers) {
        this.numberOfRunningContainers = numberOfRunningContainers;
        return this;
    }

    /**
     * Allows retrieve the number of running containers deployed on this environment
     * @method getNumberOfRunningContainers
     * @return {number}              the number of containers
     */
    getNumberOfRunningContainers() {
        return this.numberOfRunningContainers;
    }

    /**
     * Allows to set the number of stopped containers deployed on this environment in a fluent style
     * @method setNumberOfStoppedContainers
     * @param  {number}              numberOfStoppedContainers the number of stopped containers
     * @return {Environment}    this instance
     */
    setNumberOfStoppedContainers(numberOfStoppedContainers) {
        this.numberOfStoppedContainers = numberOfStoppedContainers;
        return this;
    }

    /**
     * Allows retrieve the number of stopped containers deployed on this environment
     * @method getNumberOfStoppedContainers
     * @return {number}              the number of containers
     */
    getNumberOfStoppedContainers() {
        return this.numberOfStoppedContainers;
    }

    /**
     * Allows to set the number of paused containers deployed on this environment in a fluent style
     * @method setNumberOfPausedContainers
     * @param  {number}              numberOfPausedContainers the number of paused containers
     * @return {Environment}    this instance
     */
    setNumberOfPausedContainers(numberOfPausedContainers) {
        this.numberOfPausedContainers = numberOfPausedContainers;
        return this;
    }

    /**
     * Allows retrieve the number of paused containers deployed on this environment
     * @method getNumberOfPausedContainers
     * @return {number}              the number of containers
     */
    getNumberOfPausedContainers() {
        return this.numberOfPausedContainers;
    }

    /**
     * Allows to set the number of nodes on this environment in a fluent style
     * @method setNumberOfNodes
     * @param  {number}              numberOfNodes the number of nodes
     * @return {Environment}    this instance
     */
    setNumberOfNodes(numberOfNodes) {
        this.numberOfNodes = numberOfNodes;
        return this;
    }

    /**
     * Allows retrieve the number of nodes on this environment
     * @method getNumberOfNodes
     * @return {number}              the number of nodes
     */
    getNumberOfNodes() {
        return this.numberOfNodes;
    }

    /**
     * Allows to set the number of nodes on this environment in a fluent style
     * @method setNumberOfManagers
     * @param  {number}              numberOfManagers the number of managers
     * @return {Environment}    this instance
     */
    setNumberOfManagers(numberOfManagers) {
        this.numberOfManagers = numberOfManagers;
        return this;
    }

    /**
     * Allows retrieve the number of managers on this environment
     * @method getNumberOfManagers
     * @return {number}              the number of managers
     */
    getNumberOfManagers() {
        return this.numberOfManagers;
    }

    /**
     * Allows to set the server version
     * @method setServerVersion
     * @param  {string}         serverVersion the server version
     * @return {Environment}    this instance
     */
    setServerVersion(serverVersion) {
        this.serverVersion = serverVersion;
        return this;
    }

    /**
     * Allows to retrieve the server version
     * @method getServerVersion
     * @return {string}         the server version
     */
    getServerVersion() {
        return this.serverVersion;
    }

    /**
     * Allows to set the architecture
     * @method setArchitecture
     * @param  {string}        architecture the architecture
     * @return {Environment}    this instance
     */
    setArchitecture(architecture) {
        this.architecture = architecture;
        return this;
    }

    /**
     * Allows to retrieve the environment architecture
     * @method getArchitecture
     * @return {string}        the architecture
     */
    getArchitecture() {
        return this.architecture;
    }

    /**
     * Allows to set the OS type
     * @method setOsType
     * @param  {string}  osType the OS type
     * @return {Environment}    this instance
     */
    setOsType(osType) {
        this.osType = osType;
        return this;
    }

    /**
     * Allows to retrieve the environment OS type
     * @method getOsType
     * @return {string}        the OS type
     */
    getOsType() {
        return this.osType;
    }

    /**
     * Allows to set the operating system
     * @method setOperatingSystem
     * @param  {string}  osType the OS
     * @return {Environment}    this instance
     */
    setOperatingSystem(operatingSystem) {
        this.operatingSystem = operatingSystem;
        return this;
    }

    /**
     * Allows to retrieve the environment OS
     * @method getOperatingSystem
     * @return {string}        the OS
     */
    getOperatingSystem() {
        return this.operatingSystem;
    }

    /**
     * Allows to set the kernel version
     * @method setKernelVersion
     * @param  {string}  kernelVersion the kernel version
     * @return {Environment}    this instance
     */
    setKernelVersion(kernelVersion) {
        this.kernelVersion = kernelVersion;
        return this;
    }

    /**
     * Allows to retrieve the environment kernel version
     * @method getKernelVersion
     * @return {string}        the kernel version
     */
    getKernelVersion() {
        return this.kernelVersion;
    }

    /**
     * Add a new node to this environment
     * @param {Node} node the node to add
     * @return {Environment} this environment instance
     */
    addNode(node) {
        this.nodes.set(node.getId(), node);
        return this;
    }

    /**
     * Set the node on this environment
     * @param {Array.<Node>} nodes the nodes to set
     * @return {Environment} this environment instance
     */
    setNodes(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            this.nodes.set(node.getId(), node);
        }
        return this
    }

    /**
     * Retrieve a node via its identifier
     * @param  {string} nodeId the node identifier
     * @return {Node}        the node requested or null
     */
    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }

    /**
     * Retrieve all nodes defined on this environment
     * @return {Array.<Node>} the nodes present on this environment
     */
    getNodes() {
        return Array.from(this.nodes.valueOf());
    }

    /**
     * Verifies if the requested node is part of this environment.
     * @param  {string}  nodeId the node identifier
     * @return {Boolean}        true if the node exists, false otherwise.
     */
    hasNode(nodeId) {
        return this.nodes.has(nodeId);
    }

    /**
     * Add a container to the requested node if the node exists.
     * @param {string} nodeId    the node identifier
     * @param {Container} container the container to add to the node
     * @return {Boolean} true if the node exists and the container is added, false oterwise
     */
    addContainerToNode(nodeId, container) {
        if (this.hasNode(nodeId)) {
            this.nodes.get(nodeId).addContainer(container);
            return true;
        }
        return false;
    }

    /**
     * Allow to add containers to this repository in a fluent manner
     * @method setContainers
     * @param  {Array<Container>}      containers the containers to add to this environment
     * @return {Environment}  this environment
     */
    setContainers(containers) {
        for (let container of containers) {
            this.containers.set(container.getContainerId(), container);
        }
        return this;
    }

    /**
     * Retrieve the container present on this environemnt
     * @method getContainers
     * @return {Map<Container>}      the container present on this environemnt
     */
    getContainers() {
        return this.containers;
    }

    /**
     * Retrieves all containers deployed on the requested node.
     * @param {string} node the node name
     * @return {Array.<Container>}  the containers deployed on the requested node
     */
    getContainersOnNode(node) {

        if (this.containers.size == 0) {
            return this.nodes.get(node).getContainers();
        } else {
            let answer = [];
            for (let [_, container] of this.containers) {
                if (container.isDeployedOnNode(node)) {
                    answer.push(container);
                }
            }
            return answer;
        }
    }

    /**
     * Allow retrieve a specific container via its identifier
     * @method getContainer
     * @param  {string}     containerId the container identifier
     * @return {Container}                 the container
     */
    getContainer(containerId) {
        if (this.containers.has(containerId)) {
            return this.containers.get(containerId);
        } else {
            for (let [key, node] of this.nodes) {
                if (node.hasContainer(containerId)) {
                    return node.getContainer(containerId);
                }
            }
            return null;
        }
    }

    /**
     * Allow to set the container repository in a fluent mode, the repository is set
     * only if the internal variable is not null.
     * @method setContainerRepository
     * @param  {ContainerRepository}               containerRepository an instance of ContainerRepository
     */
    setContainerRepository(containerRepository) {
        if (!this.containerRepository) {
            this.containerRepository = containerRepository;
        }
        return this;
    }

    // Business Methods

    /**
     * Inspect the received and istoric realization to discover eventual anomalies
     * for the container the realizations is received for, if any anomaly is discovered
     * then all containers on the node that contain the origin container are inspected and
     * updated if needed.
     * Other containers on a node are updated if the resources on the requested node are
     * saturated.
     * @method inspectRealizationsForAnomalies
     * @param  {Realization}          realization the realization received
     * @param  {AnomalyService}       anomalyService the anomaly service
     * @return {Array.<Container>}      the list of update containers if any
     */
    async inspectRealizationsForAnomalies(realization, anomalyService) {
        let containerId = realization.getContainerId();
        var self = this;
        return await this.lock.acquire(containerId, async function () {
            return await self._doInspectRealizationsForAnomalies(realization, anomalyService)
        });
    }

    async _doInspectRealizationsForAnomalies(realization, anomalyService) {
        let container = this.getContainer(realization.getContainerId());
        if (!container || !container.isRunning()) {
            return [];
        }
        logger.debug("inspecting realization for container %s", container.getName());
        container.addRealization(realization);

        let foundAnomalies = await container.inspect(anomalyService);
        if (foundAnomalies) {
            let answer = [];
            logger.info("found anomalies on container %s", container.getName());
            let node = null; // container.getNode();
            let containerRequirements;
            if (node) {
                containerRequirements = await this.getNode(node).distributeResources();
                logger.info("computed container requirements %s", containerRequirements);
                if (containerRequirements.size == 0) {
                    containerRequirements = container.defaultResourceRequirements();
                }
            } else {
                containerRequirements = container.defaultResourceRequirements();
            }
            if (containerRequirements.size > 0) {
                for (let [containerId, requirement] of containerRequirements) {
                    let container = this.getContainer(containerId);
                    let limits = await container.updateLimits(this.containerRepository, requirement);
                    realization.setAllocatedCpu(limits.cpu);
                    this.containerRepository.save(container);
                    answer.push(container);
                }
            } else {
                realization.setAllocatedCpu(container.getCpuLimit());
                this.containerRepository.save(container);
            }
            return answer;
        } else {
            logger.debug("no anomalies detected on container %s", container.getName());
            realization.setAllocatedCpu(container.getCpuLimit());
            this.containerRepository.save(container);
            return [container];
        }
    }
};
