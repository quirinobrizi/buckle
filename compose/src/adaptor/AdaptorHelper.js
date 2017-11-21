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

module.exports = {

    parseEnvironmentVariables: function (environment) {
        if (!environment) {
            return environment;
        }
        if (Array.isArray(environment)) {
            return environment;
        } else {
            var answer = [];
            Object.keys(environment).forEach((key) => {
                answer.push(util.format("%s=%s", key, environment[key]));
            });
            return answer;
        }
    },

    parseDevices: function (devices) {
        if (!devices) {
            return devices;
        }
        if (Array.isArray(devices)) {
            return devices;
        } else {
            var answer = [];
            Object.keys(devices).forEach((key) => {
                answer.push(util.format("%s=%s", key, devices[key]));
            });
            return answer;
        }
    },

    parseExposedPorts: function (exposedPorts) {
        if (!exposedPorts) {
            return exposedPorts;
        }
        return exposedPorts.map(exposedPort => {
            if (/\d+\/tcp|udp/g.test(exposedPort)) {
                return exposedPort;
            }
            return util.format("%s/tcp", exposedPort);
        });
    },

    parseLabels: function (labels) {
        if (!labels) {
            return undefined;
        }
        if (Array.isArray(labels)) {
            return labels.reduce((answer, label) => {
                let parts = label.split('=');
                answer[parts[0]] = parts[1];
                return answer;
            }, {});
        } else {
            return Object.assign(answer, labels);
        }
    },
    /**
     * Parses port bindings, bindings are privided in the form host:container,
     * if just the container port is provided a random port will be choosen on
     * the host.
     * @method parsePortBindings
     * @param  {array} ports the ports to map
     * @return {object}      the port mapping object
     */
    parsePortBindings: function (ports) {
        if (!ports) {
            return ports;
        }
        if (!Array.isArray(ports)) {
            throw Error("ports should be provided as array");
        }
        var answer = {};
        ports.forEach(port => {
            if (port.includes(':')) {
                // parse ports in the form: 8080:8080, 8080-8085:8080-8085
                // or variant with protocol
                var parts = port.split(':');
                var host = parts[0];
                var container = parts[1];
                if (/.*-.*/g.test(host)) {
                    // parse range
                    var hostLimits = host.split('-');
                    var hostLower = parseInt(hostLimits[0], 10);
                    var containerLimits = host.split('-');
                    var containerLower = parseInt(containerLimits[0], 10);
                    Array(parseInt(containerLimits[1], 10) + 1 - containerLower).fill().map((_, i) => {
                        var key = util.format("%s/tcp", containerLower + i);
                        answer[key] = [{
                            HostPort: util.format("%s", hostLower + i)
                        }];
                    });
                } else {
                    var key = /\d+\/tcp|udp/g.test(container) ? container : util.format("%s/tcp", container);
                    answer[key] = [{
                        HostPort: util.format("%s", host)
                    }];
                }
            } else {
                // parse container exposed ports
                if (/.*-.*/g.test(port)) {
                    // parse range
                    var limits = port.split('-');
                    var lower = parseInt(limits[0], 10);
                    Array(parseInt(limits[1], 10) + 1 - lower).fill().map((_, i) => {
                        var key = util.format("%s/tcp", lower + i);
                        answer[key] = [];
                    });
                } else {
                    var key = /\d+\/tcp|udp/g.test(port) ? port : util.format("%s/tcp", port);
                    answer[key] = [];
                }
            }
        });
        return answer;
    },

    parseUlimits: function (ulimits) {
        if (!ulimits) {
            return ulimits;
        }
        var answer = [];
        Object.keys(ulimits).forEach(ulimit => {
            var constraints = ulimits[ulimit];
            if (((typeof constraints === 'function') || (typeof constraints === 'object'))) {
                answer.push({
                    name: ulimit,
                    soft: constraints.soft,
                    hard: constraints.hard
                });
            } else {
                answer.push({
                    name: ulimit,
                    soft: constraints,
                    hard: constraints
                });
            }
        });
        return answer;
    },

    /**
     * Parses the defined volumes
     * @method parseVolumes
     * @param  {Array}     volumes the defined volumes
     * @return {Object}            An object mapping volume on the container to empty object
     */
    parseVolumes: function(volumes) {
        if (!volumes) {
            return volumes;
        }
        return volumes.reduce((a, v) => {
            let volume = v.split(':')[1];
            a[volume] = {};
            return a;
        }, {});
    },

    /**
     * Evaluate if the provided arrays are equals, the order of the elements is important,
     * arrays with same elements but different order are not considered equals.
     * @param  {Array} a one array to compare
     * @param  {Array} b another array to compare
     * @return {bolean}   true if the arrays are equals, false otherwise.
     */
    arrayEquals: function(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
};
