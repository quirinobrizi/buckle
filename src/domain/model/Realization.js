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

module.exports = class Realization {

    constructor(containerId, getName) {
        this.timestamp = null;
        this.memory = null;
        this.cpu = null;
        this.blkio = null;
        this.networks = null;
        this.containerId = containerId;
        this.getName = getName;
        this.currentCpuUsage = null;
        this.allocatedCpu = null;
    }

    setTimestamp(ts) {
        this.timestamp = ts;
        return this;
    }

    setMemory(info) {
        this.memory = info;
        return this;
    }

    getMemory() {
        return this.memory;
    }

    setCpu(info) {
        this.cpu = info;
        return this;
    }

    getCpu() {
        return this.cpu;
    }

    setBlkio(info) {
        this.blkio = info;
        return this;
    }

    setNetworks(info) {
        this.networks = info;
        return this;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getContainerName() {
        return this.getName;
    }

    getContainerId() {
        return this.containerId;
    }

    setAllocatedCpu(allocatedCpu) {
        this.allocatedCpu = allocatedCpu;
        return this;
    }

    getAllocatedCpu() {
        return this.allocatedCpu;
    }

    /**
     * Calculate the CPU used by a process unix style.
     *
     * @param {object}
     *            pre the CPU usage reading at previous instance
     * @param {object}
     *            current the current CPU usage reading
     * @return {number} the used CPU percentage
     */
    calculateCpuUsageUnix() {
        var pct = 0.0;
        var totalDelta = this.cpu.current['cpu_usage']['total_usage'] - this.cpu.previous['cpu_usage']['total_usage'];
        var systemDelta = this.cpu.current['system_cpu_usage'] - this.cpu.previous['system_cpu_usage'];

        if (totalDelta > 0 && systemDelta > 0) {
            pct = (totalDelta / systemDelta) * (this.cpu.current['online_cpus'] || this.cpu.current['cpu_usage']['percpu_usage'].length) * 100;
        }
        return pct;
    }

    calculateNetworkUsage() {
        var answer = {
            rx: 0,
            tx: 0
        };
        for (var key in this.networks) {
            var iface = this.networks[key];
            answer.rx += iface['rx_bytes'];
            answer.tx += iface['tx_bytes'];
        }
        return answer;
    }

    /**
     * Calculate block IO realization.
     *
     * @param {object}
     *            blockIo the raw block IO informatio
     * @return {object} the block IO realization. i.e. <br/> {code} { blkRead:
     *         10000 blkWrite: 3455 } {code}
     */
    calculateBlkio() {
        var answer = {
            blkRead: 0,
            blkWrite: 0
        }
        for (var key in this.blkio['io_service_bytes_recursive']) {
            var entry = this.blkio['io_service_bytes_recursive'][key];
            if (entry.op.toLowerCase() === 'read') {
                answer.blkRead += entry.total ? entry.total : entry.value;
            } else if (entry.op.toLowerCase() === 'write') {
                answer.blkWrite += entry.total ? entry.total : entry.value;
            }
        }
        return answer;
    }

}
