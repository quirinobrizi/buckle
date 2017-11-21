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

'use strict';

const Adaptor = require('./Adaptor');
const adaptorHelper = require('./AdaptorHelper');

/**
 * Parses docker compose v2 configuration file, not supporte properties are:
 *  - env_file
 *  - extends
 *  - external_links
 *  - init
 * @type {[type]}
 */
module.exports = class ComposeAdaptorV2 extends Adaptor {
    constructor() {
        super();
    }

    /**
     * Modify the proportion of bandwidth allocated to this service relative to other services.
     * Takes an integer value between 10 and 1000, with 500 being the default.
     * @param  {object} service the container definition
     * @return {Number}         A number between 10 and 1000
     */
    extractBlkioWeight(service) {
        if (service.blkio_config) {
            return service.blkio_config.weight;
        }
        return null;
    }

    /**
     * Fine-tune bandwidth allocation by device. Each item in the list must have two keys:
     *  - path, defining the symbolic path to the affected device
     *  - weight, an integer value between 10 and 1000
     *
     * @param  {object} service the container definition
     * @return {Array.<Object>} the defined defined weight or null
     */
    extractBlkioWeightDevice(service) {
        if (service.blkio_config && service.blkio_config.weight_device) {
            return service.blkio_config.weight_device.map((el) => {
                return {
                    Path: el.path,
                    Weight: el.weight
                };
            });
        }
        return null;
    }

    /**
     * Set a limit in bytes per second for read operations on a given device. Each item in the list must have two keys:
     * - path, defining the symbolic path to the affected device
     * - rate, either as an integer value representing the number of bytes or as a string expressing a byte value
     *
     * @param  {object} service the container definition
     * @return {Array.<Object>} the defined defined limit or null
     */
    extractBlkioDeviceReadBps(service) {
        if (service.blkio_config && service.blkio_config.device_read_bps) {
            return service.blkio_config.device_read_bps.map((el) => {
                return {
                    Path: el.path,
                    Rate: el.rate
                };
            });
        }
        return null;
    }

    /**
     * Set a limit in bytes per second for write operations on a given device. Each item in the list must have two keys:
     * - path, defining the symbolic path to the affected device
     * - rate, either as an integer value representing the number of bytes or as a string expressing a byte value
     *
     * @param  {object} service the container definition
     * @return {Array.<Object>} the defined defined limit or null
     */
    extractBlkioDeviceWriteBps(service) {
        if (service.blkio_config && service.blkio_config.device_write_bps) {
            return service.blkio_config.device_write_bps.map((el) => {
                return {
                    Path: el.path,
                    Rate: el.rate
                };
            });
        }
        return null;
    }

    /**
     * Set a limit in operations per second for read operations on a given device. Each item in the list must have two keys:
     * - path, defining the symbolic path to the affected device
     * - rate, as an integer value representing the permitted number of operations per second.
     *
     * @param  {object} service the container definition
     * @return {Array.<Object>} the defined defined limit or null
     */
    extractBlkioDeviceReadIOps(service) {
        if (service.blkio_config && service.blkio_config.device_read_iops) {
            return service.blkio_config.device_read_iops.map((el) => {
                return {
                    Path: el.path,
                    Rate: el.rate
                };
            });
        }
        return null;
    }

    /**
     * Set a limit in operations per second for write operations on a given device. Each item in the list must have two keys:
     * - path, defining the symbolic path to the affected device
     * - rate, as an integer value representing the permitted number of operations per second.
     *
     * @param  {object} service the container definition
     * @return {Array.<Object>} the defined defined limit or null
     */
    extractBlkioDeviceWriteIOps(service) {
        if (service.blkio_config && service.blkio_config.device_write_iops) {
            return service.blkio_config.device_write_iops.map((el) => {
                return {
                    Path: el.path,
                    Rate: el.rate
                };
            });
        }
        return null;
    }

    extractDnsOptions(service) {
        return service.dns_opt;
    }

    extractTmpfs(service) {
        if (!service.tmpfs) {
            return null;
        }
        if (Array.isArray(service.tmpfs)) {
            return service.tmpfs.reduce((answer, fs) => {
                return answer[fs] = "rw,noexec,nosuid,size=65536k";
            });
        }
        let answer = {};
        answer[service.tmpfs] = "rw,noexec,nosuid,size=65536k";
        return answer;
    }

    extractHealthCheck(service) {
        if (service.healthcheck) {
            if (service.healthcheck.disable) {
                return {
                    Test: ["NONE"]
                };
            }
            return {
                Test: service.healthcheck.test,
                Interval: service.healthcheck.interval,
                Timeout: service.healthcheck.timeout,
                Retries: service.healthcheck.retries,
                StartPeriod: service.healthcheck.start_period
            };
        }
        return null;
    }

    extractIsolation(service) {
        return service.isolation;
    }

    extractNetworkMode(service) {
        return service.network_mode;
    }

    /**
     * Extract the network configuration.
     * @param  {Object} service  the service configuration
     * @param  {Array.<Object>} networks the networks configuration
     * @return {Object}          the computed network configuration consumable from docker APIs
     */
    extractNetworkingConfig(service, networks) {
        if (!service.networks|| !networks) {
            return {
                EndpointsConfig: {}
            };
        }
        let doExtractConfig = function(networkConfig, networkName, config) {
            console.log("parsing network %s", networkName);
            if(!networks[networkName]) {
                throw new Error("network " + networkName + " is not defined");
            }
            if(!config) {
                networkConfig.EndpointsConfig[name] = {};
            }
            networkConfig.EndpointsConfig[networkName] = {
                Aliases: config.aliases,
                IPAMConfig: {
                    IPv4Address: config.app_net.ipv4_address,
                    IPv6Address: config.app_net.ipv6_address,
                    LinkLocalIPs: config.app_net.link_local_ips
                }
            }
            return networkConfig;
        };

        if (typeof service.networks === 'object') {
            Object.entries(service.networks).reduce((networkConfig, [name, config]) => {
                return doExtractConfig(networkConfig, name, config);
            }, { EndpointsConfig: {} });
        } else {
            return service.networks.reduce((networkConfig, name) => {
                return doExtractConfig(networkConfig, name, config);
            }, { EndpointsConfig: {} });
        }
    }

    extractPidsLimit(service) {
        return service.pids_limit;
    }

    extractStorageOpt(service) {
        return service.storage_opt;
    }

    extractSysctls(service) {
        return service.sysctls;
    }

    extractUsernsMode(service) {
        return service.userns_mode;
    }

    extractRestartPolicy(service) {
        return service.restart;
    }

    extractStdinOnce(service) { }

    extractArgsEscaped(service) { }

    extractNetworkDisabled(service) { }
    extractShell(service) { }

    extractKernelMemory(service) { }

    extractMemory(service) { return service.mem_limit; }

    extractMemoryReservation(service) { return service.mem_reservation; }

    extractMemorySwap(service) { return service.memswap_limit; }

    extractMemorySwappiness(service) { return service.mem_swappiness; }

    extractCpuPercent(service) { return service.cpu_percent; }
    extractCpuPeriod(service) { }
    extractCpuRealtimePeriod(service) { }
    extractCpuRealtimeRuntime(service) { }
    extractCpusetMems(service) { }
    extractCpuCount(service) { return service.cpu_count; }
    extractNanoCPUs(service) { }

    extractOomScoreAdj(service) { return service.oom_score_adj; }

    extractDeviceCgroupRules(service) {}
    extractDiskQuota(service) {}
    extractOomKillDisable(service) {}
    extractIOMaximumIOps(service) {}
    extractIOMaximumBandwidth(service) {}
    extractContainerIDFile(service) {}
    extractAutoRemove(service) {}
    extractMounts(service) {}
    extractGroupAdd(service) {}
    extractCgroup(service) {}
    extractPublishAllPorts(service) {}
    extractUTSMode(service) {}
    extractRuntime(service) {}
    extractConsoleSize(service) {}
};
