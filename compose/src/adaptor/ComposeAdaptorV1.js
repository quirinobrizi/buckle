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

module.exports = class ComposeAdaptorV1 extends Adaptor {

    constructor() {
        super();
    }

    extractMemory(service) { return service.mem_limit; }

    extractBlkioWeight(service) { }

    extractStdinOnce(service) { }

    extractHealthCheck(service) { }

    extractArgsEscaped(service) { }

    extractBlkioWeightDevice(service) { }

    extractBlkioDeviceReadBps(service) { }

    extractBlkioDeviceWriteBps(service) { }

    extractBlkioDeviceReadIOps(service) { }

    extractBlkioDeviceWriteIOps(service) { }

    extractCpuPeriod(service) { }

    extractCpuRealtimePeriod(service) { }

    extractCpuRealtimeRuntime(service) { }

    extractCpusetMems(service) { }

    extractDeviceCgroupRules(service) { }

    extractDiskQuota(service) { }

    extractNetworkMode(service) { return service.net; }

    extractCpuCount(service) { }

    extractNetworkDisabled(service) { }

    extractShell(service) { }

    extractKernelMemory(service) { }

    extractMemoryReservation(service) { }

    extractMemorySwap(service) { }

    extractMemorySwappiness(service) { }

    extractNanoCPUs(service) { }

    extractOomKillDisable(service) { }

    extractPidsLimit(service) { }

    extractCpuPercent(service) { }

    extractIOMaximumIOps(service) { }

    extractIOMaximumBandwidth(service) { }

    extractContainerIDFile(service) { }

    extractRestartPolicy(service) { return { name: service.restart }; }

    extractAutoRemove(service) { }

    extractMounts(service) { }

    extractExtraHosts(service) { }

    extractGroupAdd(service) { }

    extractCgroup(service) { }

    extractOomScoreAdj(service) { }

    extractPublishAllPorts(service) { }

    extractStorageOpt(service) { }

    extractDnsOptions(service) { }

    extractTmpfs(service) { }

    extractUTSMode(service) { }

    extractUsernsMode(service) { }

    extractSysctls(service) { }

    extractRuntime(service) { }

    extractConsoleSize(service) { }

    extractIsolation(service) { }

    extractNetworkingConfig(service) { }
};
