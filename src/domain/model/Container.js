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

const metricsHelper = require('../../infrastructure/helper/MetricsHelper');
const logger = require('../../infrastructure/Logger');

const MIN_CPU_QUOTA = 15000;
const MAX_CPU_QUOTA = 95000;
const MIN_MEMORY = 536870912;
const MIN_MEMORY_RESERVATION = 268435456;
const MEMORY_INCREMENT_PCT = 15;
const MEMORY_RESERVATION_INCREMENT_PCT = 10;

module.exports = class Container {

    constructor(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.hostConfig = null;
        this.config = null;
        this.networkSettings = null;
        this.status = null;
        this.state = null;
        this.node = null;
        this.created = null;
        this.realizations = [];
        this.anomalies = [];
        this.maxRealizationCollectionTime = 180000;
        this.lastUpdate = 0;
        this.lastInspection = 0;
    }

    /**
     * Retrieve the container identifier
     * @method containerId
     * @return {string}    the container identifier
     */
    getContainerId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getLastUpdate() {
        return this.lastUpdate;
    }

    setLastUpdate(lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    containerImage() {
        var imageMatch = /([^:]*):?(.*)$/g.exec(this.image);
        if (!imageMatch) {
            imageMatch = /(.+)@.*/g.exec(this.image);
        }
        return imageMatch ? imageMatch[1] : this.image;
    }

    containerVersion() {
        let match;
        if (this.image.includes('@')) {
            match = /([^:]+):?(.+)@/g.exec(this.image);
        } else {
            match = /([^:]*):?(.*)$/g.exec(this.image);
            if (!match) {
                match = /^(.+)@.+/g.exec(this.image);
            }
        }
        return match[2] || 'latest';
    }

    /**
     * Allow to provide host configuration in a fluent style.
     *
     * @param {object}
     *            the host configuration
     * @return {object} this container instance
     */
    setHostConfig(hostConfig) {
        this.hostConfig = hostConfig;
        return this;
    }

    getHostConfig() {
        return this.hostConfig;
    }

    getNetworkMode() {
        return this.hostConfig.NetworkMode;
    }

    getIpAddress() {
        var nm = this.getNetworkMode();
        return this.networkSettings.Networks[nm === 'default' ? 'bridge' : nm].IPAddress;
    }

    /**
     * Allow to provide container configuration in a fluent style.
     *
     * @param {object}
     *            the container configuration
     * @return {object} this container instance
     */
    setConfig(config) {
        this.config = config;
        return this;
    }

    getConfig() {
        return this.config;
    }

    /**
     * Allow to provide network configuration in a fluent style.
     *
     * @param {object}
     *            the container network configuration
     * @return {object} this container instance
     */
    setNetworkSettings(networkSettings) {
        this.networkSettings = networkSettings;
        return this;
    }

    /**
     * Allow to provide information about the container status in a fluent
     * style.
     *
     * @param {string}
     *            the container status
     * @return {object} this container instance
     */
    setStatus(status) {
        this.status = status;
        return this;
    }

    getStatus() {
        return this.status;
    }

    setState(state) {
        this.state = state;
        return this;
    }

    getState() {
        return this.state;
    }

    /**
     * The name of the node this container is deployed on
     *
     * @param {string}
     *            the container node
     * @return {Container} this container instance
     */
    setNode(node) {
        this.node = node;
        return this;
    }

    /**
     * Retrieves name of the node this container is deployed on
     * @method getNode
     * @return {string} name of the node this container is deployed on
     */
    getNode() {
        return this.node;
    }

    /**
     * Validate if this container is deployed on the requested node.
     * @param  {string}  node The node name
     * @return {Boolean}      true if this container is deployed on the requested node, false otherwise.
     */
    isDeployedOnNode(node) {
        return this.node === node;
    }

    /**
     * Allow to provide information about this container creation date in a
     * fluent style.
     *
     * @param {number}
     *            the container creation time
     * @return {object} this container instance
     */
    setCreatedTimestamp(created) {
        this.created = created;
        return this;
    }

    getCreatedTimestamp() {
        return this.created;
    }

    /**
     * Validate if the container is running for at least the requested minutes
     *
     * @param {number}
     *            minutes
     * @returns true if the container is running for more than the requested
     *          minutes, false otherwise.
     */
    isRunningForAtLeastMinutes(minutes) {
        return (Date.now() - (minutes * 60 * 1000)) > this.created;
    }

    addRealization(stats) {
        this.realizations.push(stats);
        if (this.realizations[0].getTimestamp() < (Date.now() - this.maxRealizationCollectionTime)) {
            logger.debug("removing realization as it is expired");
            this.realizations.splice(0, 1);
        }
        return this;
    }

    setRealization(stats) {
        this.realizations = stats;
        return this;
    }

    /**
     * Allows to retrieve statistical realizations for this container
     * @method getRealizations
     * @return {Array.<Realization>}        The realizations
     */
    getRealizations() {
        return this.realizations;
    }

    getLatestRealization() {
        return this.realizations[this.realizations.length - 1];
    }

    getLatestMemoryRealization() {
        var stats = this.getLatestRealization();
        return !stats ? 0 : stats.getMemory();
    }

    getLatestCpuRealization() {
        var stats = this.getLatestRealization();
        return !stats ? 0 : stats.getCpu();
    }

    getLatestCpuUsage() {
        var stats = this.getLatestRealization();
        return !stats ? 0 : stats.calculateCpuUsageUnix();
    }

    getCpuLimit() {
        var cpuPeriod = this.hostConfig.CpuPeriod;
        var cpuQuota = this.hostConfig.CpuQuota;
        if (!cpuPeriod || cpuPeriod == 0) {
            return 0;
        }
        return (cpuQuota * 100) / cpuPeriod;
    }

    setAnomalies(anomalies) {
        this.anomalies = anomalies;
        return this;
    }

    getAnomalies() {
        return this.anomalies;
    }

    hasAnomalies() {
        return this.anomalies && this.anomalies.length > 0;
    }

    /**
     * Evaluate if any of the requested anomalies types are active for this
     * container.
     *
     * @param {array}
     *            types the list of anomalies to check
     * @return {Boolean} true if any of the requested anomalies if present,
     *         false otherwise
     */
    hasAnomaliesOfType(types) {
        if (!this.anomalies) {
            return false;
        }
        var answer = false;
        for (var i = 0; i < this.anomalies.length; i++) {
            var anomaly = this.anomalies[i];
            for (var i = 0; i < types.length; i++) {
                logger.debug("anomaly type %s includes? %s", anomaly.type, types[i]);
                if (anomaly.type.includes(types[i])) {
                    return true;
                }
            }
        }
        return answer;
    }

    hasBeenInspectedAtLeastSecondsAgo(seconds) {
        let secondsSince = Math.trunc((Date.now() - this.lastInspection) / 1000);
        logger.info("seconds since last inspection %s, requested %s", secondsSince, seconds);
        return secondsSince >= seconds
    }

    /**
     * Inspect this container for anomalies
     * @param  {AnomalyService]} anomalyService the service to use for the anomalies inspection
     * @return {Boolean} true if the container has anomalies, false otherwise
     */
    async inspect(anomalyService) {
        this.lastInspection = Date.now();
        this.anomalies = await anomalyService.process(this);
        logger.debug("anomalies inspection terminated, container %s has anomalies %s, %s", this.getName(), this.hasAnomalies(), JSON.stringify(this.anomalies));
        return this.hasAnomalies();
    }

    /**
     * Update limits for this service if needed
     *
     * @param  {ConfigurationService} configurationService the configuration service
     * @param {Any} requirements the new limits requirements
     * @return {boolean} true if the container has been updated. false otherwise;
     */
    async updateLimits(containerRepository, requirements) {
        let secondsSinceLastUpdate = Math.trunc((Date.now() - this.lastUpdate) / 1000);
        logger.info('updating container %s last update %s seconds ago [%s - %s]', this.name, secondsSinceLastUpdate, Date.now(), this.lastUpdate);
        try {
            let limits = this.buildLimitsConfiguration(requirements);
            let resp = await containerRepository.update(this.id, limits);
            logger.info("container %s configuration updated %s", this.name, JSON.stringify(resp));
            return {
                cpu: this.getCpuLimit(),
                memory: limits.Memory
            };
        } catch (e) {
            logger.error("unable to update container %s %s", this.getName(), e.stack);
            return false;
        } finally {
            this.lastUpdate = Date.now();
        }
    }

    needToBeUpdated() {
        return this.getStatus() === 'running' &&
            (this.hasAnomaliesOfType(["cpu"]) || this.hasAnomaliesOfType(["memory"]));
    }

    defaultResourceRequirements() {
        let answer = new Map()
        answer.set(this.getContainerId(), {
            cpu: this.calculateRequiredCpuQuota(),
            memory: this.calculateRequiredMemory()
        });
        return answer;
    }

    /**
     * Builds limits configuration for this container based on the current
     * status and anomalies detected.
     *
     * @param {Any} requirements the new limits requirements
     * @return {object} the limits configuration
     */
    buildLimitsConfiguration(requirements) {
        logger.info("Found %s anomalies %s", this.anomalies.length, JSON.stringify(this.anomalies));
        var config = {};
        this._addCpuConfigIfNeeded(config, requirements.cpu);
        this._addMemoryConfigIfNeeded(config, requirements.memory);
        return config;
    }

    /**
     * Calculate the CPU quota required by this container considering the current and historic realizations
     * @method calculateRequiredCpuQuota
     * @return {number}                  the container required CPU quota
     */
    calculateRequiredCpuQuota() {
        if (!this.needToBeUpdated()) {
            return this.hostConfig.CpuQuota;
        }
        var cpu = metricsHelper.calculateAverage(this.realizations, value => {
            return value.calculateCpuUsageUnix();
        });
        return metricsHelper.calculateCpuQuota(cpu, MIN_CPU_QUOTA, MAX_CPU_QUOTA);
    }

    /**
     * Calculate the memory required by this container considering the current and historic realizations
     * @method calculateRequiredMemory
     * @return {number}                  the container required memory
     */
    calculateRequiredMemory() {
        if (!this.needToBeUpdated()) {
            return this.hostConfig.Memory;
        }
        var memory = metricsHelper.calculateAverage(this.realizations, value => {
            return value.getMemory().current;
        });
        return memory;
    }

    _addCpuConfigIfNeeded(config, cpuQuota) {
        if (cpuQuota < 95000 && this.hasAnomalies() && !this.hasAnomaliesOfType(["cpu"])) {
            return;
        }
        config.CpuPeriod = metricsHelper.ONE_SEC_IN_JIFFY;
        config.CpuQuota = cpuQuota;

        this.hostConfig.CpuPeriod = config.CpuPeriod;
        this.hostConfig.CpuQuota = config.CpuQuota;
    }

    _addMemoryConfigIfNeeded(config, memory) {
        if (this.hasAnomalies() && !this.hasAnomaliesOfType(["memory"])) {
            return;
        }
        config.MemoryReservation = metricsHelper.calculateMemoryReservation(memory, MEMORY_RESERVATION_INCREMENT_PCT, MIN_MEMORY_RESERVATION);
        config.Memory = metricsHelper.calculateMemoryReservation(memory, MEMORY_INCREMENT_PCT, MIN_MEMORY);
        config.MemorySwappiness = 0;
        config.MemorySwap = config.Memory + MIN_MEMORY_RESERVATION;

        this.hostConfig.MemoryReservation = config.MemoryReservation;
        this.hostConfig.Memory = config.Memory;
    }

}
