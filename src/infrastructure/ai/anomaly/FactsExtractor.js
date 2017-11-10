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

module.exports = {
    hostConfig: function(params, almanac) {
        return almanac.factValue('container')
            .then((container) => {
                return container.getHostConfig();
            });
    },

    memoryStats: function(params, almanac) {
        return almanac.factValue('container')
            .then((realization) => {
                return container.getLatestMemoryRealization();
            });
    },

    cpuStats: function(params, almanac) {
        return almanac.factValue('container')
            .then((container) => {
                return container.getLatestCpuRealization();
            });
    },

    lastCpuUsagePercentage: function(params, almanac) {
        return almanac.factValue('container')
            .then((container) => {
                return container.getLatestCpuUsage();
            });
    },

    lastMemoryUsage: function(params, almanac) {
        return almanac.factValue('container')
            .then((container) => {
                return container.getLatestMemoryRealization().current;
            });
    },

    currentMemoryLimit: function(params, almanac) {
        return almanac.factValue('container')
            .then((container) => {
                return container.getLatestMemoryRealization().limit;
            });
    },

    currentCpuUsagePercentage: function(params, almanac) {
        return almanac.factValue('container')
            .then((container) => {
                return container.getLatestCpuUsage();
            });
    },

    currentCpuLimit: function(params, almanac) {
        return almanac.factValue('container')
            .then((container) => {
                return container.getCpuLimit();
            });
    },

    secondsSinceLastUpdate: function(params, almanac) {
        return almanac.factValue('container')
            .then((container) => {
                return Math.trunc((Date.now() - container.getLastUpdate()) / 1000);
            });
    }
};