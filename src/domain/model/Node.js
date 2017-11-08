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

const logger = require('../../infrastructure/Logger');
const metricsHelper = require('../../infrastructure/helper/MetricsHelper');

module.exports = class Node {
    /**
     * Create a new node instance
     * @param  {string} id the node identifier
     * @return {Node}    A node instance
     */
    constructor(id) {
        this.id = id;
        this.properties = new Map();
        this.containers = new Map();
    }

    static default(id) {
        return new Node(id);
    }

    /**
     * Retrieves the identifier of this node
     * @method getId
     * @return {string} the node identifier
     */
    getId() {
        return this.id;
    }

    /**
     * Set the node IP Address in a fluent mode
     * @method setIp
     * @param  {string} ip the IP address
     * @return {Node} this node
     */
    setIp(ip) {
        if (!this.ip) {
            this.ip = ip;
        }
        return this;
    }

    /**
     * Retrieve the IP Address
     * @method getIp
     * @return {string} the node IP Address
     */
    getIp() {
        return this.ip;
    }

    /**
     * Allow to set the combination IP:PORT of the docker deamon running on this node.
     * @method setAddress
     * @param  {string}   address the combination IP:PORT.
     * @return {Node} this node
     */
    setDaemonAddress(address) {
        if (!this.address) {
            this.address = address;
        }
        return this;
    }

    /**
     * Retrieve the combonation IP:PORT of the docker daemon running on this host
     * @method getDaemonAddress
     * @return {string}   address the combination IP:PORT.
     */
    getDaemonAddress() {
        return this.address;
    }

    /**
     * Set the name of this node
     * @param {string} name The name of the node
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * Allow retrieve this node name
     * @method getName
     * @return {string} this node name
     */
    getName() {
        return this.name;
    }

    /**
     * Set the role of this node, manager or node
     * @param {string} role the node role
     */
    setRole(role) {
        this.role = role;
        return this;
    }

    /**
     * Retrieve this node role
     * @return {string} the role
     */
    getRole() {
        return this.role;
    }

    setNumOfCpus(numOfCpus) {
        this.numOfCpus = numOfCpus;
        return this;
    }

    getNumberOfCpus() {
        return this.numOfCpus;
    }

    /**
     * Set the max CPU quota available on this node.
     * @method setMaxCpuQuota
     * @param  {number}       maxCpuQuota the max CPU quota
     * @return {Node} this node
     */
    setMaxCpuQuota(maxCpuQuota) {
        if (!this.maxCpuQuota) {
            this.maxCpuQuota = maxCpuQuota;
        }
        return this;
    }

    /**
     * Retrive the max CPU quota available on this node.
     * @method getMaxCpuQuota
     * @return {number}       maxCpuQuota the max CPU quota
     */
    getMaxCpuQuota() {
        return this.maxCpuQuota;
    }

    /**
     * Set the memory, expressed in byte, available on this node.
     * @method setMemory
     * @param  {number}  memory the memory available on this node
     */
    setMemory(memory) {
        if (!this.memory) {
            this.memory = memory;
        }
        return this;
    }

    /**
     * Retrive the memory, expressed in byte, available on this node
     * @method getMemory
     * @return {number}  memory the memory available on this node
     */
    getMemory() {
        return this.memory;
    }

    /**
     * Allow to add generic properties to this node.
     * @method addProperty
     * @param  {string}    key   the property name
     * @param  {Any}       value the property value
     */
    addProperty(key, value) {
        this.properties.set(key, value);
    }

    /**
     * Allow to retrieve a specific property of this node
     * @method getProperty
     * @param  {string}    key the property key
     * @return {Any}        The property value
     */
    getProperty(key) {
        return this.properties.get(key);
    }

    /**
     * Allow to retieve all properties defined for this node
     * @method getProperties
     * @return {Map}      the properties of this host
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Add a new container to the node.
     * @param {Container} container the container to add
     */
    addContainer(container) {
        this.containers.set(container.getContainerId(), container);
    }

    /**
     * Retrieve the requested contract if exists
     * @param  {string} containerId the container identifier
     * @return {Container}          the container or null if the id is not found
     */
    getContainer(containerId) {
        return this.containers.get(containerId);
    }

    /**
     * Retrieve all containers running on this node
     * @return {Array.<Container>} the containers running on this node.
     */
    getContainers() {
        return Array.from(this.containers.values());
    }

    hasContainer(containerId) {
        return this.containers.has(containerId);
    }

    /**
     * Distribute this container resources to all containers deployed
     * on this node. The distribution is done heuristically meaning that
     * the resources are assigned as best as possible without search for the
     * absolute optimum.
     * @method distributeResources
     * @return {Map}                 the updated containers
     */
    async distributeResources(containers) {
        let maxCpuQuota = this.getMaxCpuQuota() ? this.getMaxCpuQuota() : (this.getNumberOfCpus() * metricsHelper.ONE_SEC_IN_JIFFY) / this.containers.length;
        let maxMemoryQuota = (this.getMemory() / this.containers.length);
        let requirements = new Map();

        logger.info("Quotas: CPU: %s Memory: %s", maxCpuQuota, maxMemoryQuota);
        if(isNaN(maxCpuQuota) || isNaN(maxMemoryQuota)) {
            return requirements
        }

        let excessRequiredBy = [];
        let cpuExcess = 0;
        let memoryExcess = 0;

        logger.info("Node %s has available container quotas CPU: %s, Memory: %s", this.getName(), maxCpuQuota, maxMemoryQuota);
        for (let [id, container] of this.containers) {
            let cpuQuota = container.calculateRequiredCpuQuota();
            let memoryQuota = container.calculateRequiredMemory();

            let currentCpuExcess = maxCpuQuota - cpuQuota;
            let currentMemoryExcess = maxMemoryQuota - memoryQuota;
            logger.info("Excess for container %s, CPU: %s, memory: %s", container.getName(), currentCpuExcess, currentMemoryExcess);

            if(currentCpuExcess < 0 || currentMemoryExcess < 0) {
                logger.info("container %s requires resources from above the standard qouta", container.getName())
                excessRequiredBy.push(container);
            };
            if(currentCpuExcess > 0) {
                cpuExcess += currentCpuExcess;
            }
            if(currentMemoryExcess > 0) {
                memoryExcess += currentMemoryExcess;
            }

            requirements.set(container, {
                cpu: cpuQuota,
                memory: currentMemoryExcess >= 0 ? memoryQuota : currentMemoryExcess,
                cpuExcess: currentCpuExcess,
                memoryExcess: currentMemoryExcess
            });
        }

        for (let i = 0; i < excessRequiredBy.length; i++) {
            let container = excessRequiredBy[i];
            let requirement = requirements.get(container);
            logger.info("container %s requires, CPU: %s, Memory: %s", container.getName(), requirement.cpu, requirement.memory);
            if(requirement.cpuExcess < 0) {
                logger.info("available cpu excess: %s", cpuExcess);
                if(Math.abs(requirement.cpuExcess) < cpuExcess) {
                    cpuExcess += requirement.cpuExcess;
                } else {
                    // requirement.cpuExcess is negative...
                    let newCpuExcess = requirement.cpuExcess + cpuExcess;
                    requirement.cpu = (requirement.cpu + requirement.cpuExcess) + cpuExcess;
                    requirement.cpuExcess = newCpuExcess;
                    cpuExcess = 0;
                }
            }
            if(requirement.memoryExcess < 0) {
                if(Math.abs(requirement.memoryExcess) < memoryExcess) {
                    memoryExcess += requirement.memoryExcess;
                } else {
                    // requirement.memoryExcess is negative...
                    let newMemoryExcess = requirement.memoryExcess + memoryExcess;
                    requirement.memory = (requirement.memory + requirement.memoryExcess) + memoryExcess;
                    requirement.memoryExcess = newMemoryExcess;
                    memoryExcess = 0;
                }
            }
        }
        return requirements;
    }

};
