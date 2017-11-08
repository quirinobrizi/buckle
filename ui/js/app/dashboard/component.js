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

angular
    .module('dashboard')
    .component('dashboard', {
        templateUrl: 'js/app/dashboard/template.html',
        controller: ['Volumes', 'System', 'Networks', 'Images', '$q',
            function DashboardController(Volumes, System, Networks, Images, $q) {
                var self = this;

                self.$onInit = function() {
                    self.loading = true;
                    self._loadDashboard();
                }

                self.containersPerCluster = function(clusters) {
                    let numOfContainers = clusters.containers.number;
                    let numOfclusters = cluster.number;
                    if (numOfContainers > 0 && numOfclusters > 0) {
                        return numOfContainers / numOfclusters;
                    }
                    return 0;
                }

                self._loadDashboard = function() {
                    var self = this;
                    $q.all([
                            Volumes.get().$promise.catch(angular.noop),
                            System.info().$promise.catch(angular.noop),
                            Networks.get().$promise.catch(angular.noop),
                            Images.get().$promise.catch(angular.noop)
                        ])
                        .then(function(rs) {
                            var volumes = rs[0] ? rs[0] : null;
                            var system = rs[1] ? rs[1].toJSON() : null;
                            var networks = rs[2] ? rs[2] : null;
                            var images = rs[3] ? rs[3] : null;
                            self.statistics = self._aggregateStatistics(volumes, system, networks, images);
                            self.loading = false;
                        })
                        .catch(console.log);
                }

                self._aggregateStatistics = function(_volumes, _system, _networks, _images) {
                    var statistics = {
                        containers: {
                            number: _system.numberOfContainers,
                            running: _system.numberOfRunningContainers,
                            stopped: _system.numberOfStoppedContainers,
                            paused: _system.numberOfPausedContainers
                        },
                        volumes: this._inspectVolumes(_volumes),
                        system: {
                            name: _system ? _system.name : 'unknown',
                            version: _system ? _system.serverVersion : 'unknown',
                            // cpus: _system ? _system.NCPU : 'unknown',
                            // memory: _system ? parseFloat(_system.MemTotal / 1000000000).toFixed(2) + " GB" : 'unknown',
                            os: _system ? _system.operatingSystem : 'unknown',
                            kernel: _system ? _system.kernelVersion : 'unknown',
                            nodes: _system ? _system.numberOfNodes : "unknown",
                            managers: _system ? _system.numberOfManagers : "unknown"
                        },
                        networks: this._inspectNetworks(_networks),
                        images: this._inspectImages(_images)
                    };
                    return statistics;
                }

                self._inspectContainers = function(clusters) {
                    var containers = {
                        number: 0,
                        running: 0,
                        stopped: 0,
                        perCluster: 0
                    };
                    if (clusters) {
                        let keys = Object.keys(clusters);
                        for (let key in Object.keys(keys)) {
                            let cluster = clusters[key];
                            containers.number += cluster.containers.length;
                            cluster.containers.forEach(function(container) {
                                if ("running" === container.state) {
                                    containers.running += 1;
                                } else {
                                    containers.stopped += 1;
                                }
                            });
                        }
                        if(keys.length > 0) {
                            containers.perCluster = containers.number / keys.length;
                        }
                    }
                    return containers;
                }

                self._inspectVolumes = function(volumes) {
                    if (volumes) {
                        var answer = {
                            number: volumes.length,
                            drivers: {}
                        };

                        volumes.forEach(function(volume) {
                            if (!answer.drivers.hasOwnProperty(volume.Driver)) {
                                answer.drivers[volume.Driver] = 1;
                            } else {
                                answer.drivers[volume.Driver] += 1;
                            }
                        });
                        return answer;
                    }
                    return {};
                }

                self._inspectNetworks = function(networks) {
                    if (networks) {
                        var answer = {
                            number: networks.length,
                            drivers: {}
                        }
                        networks.forEach(function(network) {
                            if (!answer.drivers.hasOwnProperty(network.Driver)) {
                                answer.drivers[network.Driver] = 1;
                            } else {
                                answer.drivers[network.Driver] += 1;
                            }
                        });
                        return answer;
                    }
                    return {};
                }

                self._inspectImages = function(images) {
                    if (images) {
                        var answer = {
                            number: images.length,
                            tags: {}
                        };
                        images.forEach(function(image) {
                            var cluster = /(.*)@sha256/g.exec(image.RepoDigests[0])[1];
                            answer.tags[cluster] = image.RepoTags ? image.RepoTags.length : 0;
                        });
                        return answer;
                    }
                    return {};
                }
            }
        ]
    });
