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
    .module('clusters')
    .component('clusters', {
        templateUrl: 'js/app/clusters/template.html',
        controller: ['Environment', 'Clusters', 'Repositories', '$uibModal', 'Bus', '$scope', '$q',
            function ClustersController(Environment, Clusters, Repositories, $uibModal, Bus, $scope, $q) {
                var self = this;

                self.$onInit = function () {
                    self.serverError = false;
                    self.loading = true;
                    self._loadClusters();
                    self._registerListeners();
                }

                self.$onDestroy = function () {
                    Bus.remove('containers.started');
                    Bus.remove('containers.stopped');
                    Bus.remove('containers.removed');
                }

                self.removeCluster = function (name) {
                    if (confirm("Removing all containers for " + name)) {
                        Clusters.remove({
                                key: name
                            }).$promise
                            .then(self._loadClusters)
                            .catch(self._handleError);
                    }
                }

                self.deleteContainer = function (cluster, container) {
                    if (confirm("Removing " + container + " from " + cluster)) {
                        Clusters.removeContainer({
                                key: cluster,
                                containerId: container
                            }).$promise
                            .then(self._loadClusters)
                            .catch(self._handleError);
                    }
                }

                self.scaleClusterContainers = function (cardinality, clusters) {
                    var cluster = clusters[0];
                    if (confirm("Scaling " + cluster.name + " from " + clusters.length + " to " + cardinality)) {
                        Clusters.scale({
                                key: cluster.name
                            }, {
                                image: cluster.image,
                                tag: cluster.version,
                                cardinality: cardinality,
                                name: cluster.name
                            }).$promise
                            .then(self._loadClusters)
                            .catch(self._handleError);
                    }
                }

                self.deployClusterContainers = function (baseContainer, tag, cardinality) {
                    if (confirm("Deploying version " + tag + " for " + baseContainer.name + " image: " + baseContainer.image)) {
                        Clusters.deploy({
                                key: baseContainer.name
                            }, {
                                name: baseContainer.name,
                                image: baseContainer.image,
                                tag: tag,
                                cardinality: cardinality
                            })
                            .$promise
                            .then(self._loadClusters)
                            .catch(self._handleError);
                    }
                };

                self.deployWithDockerCompose = function(composeFiles) {
                    console.log(composeFiles);
                }

                self.openDeployClustersModal = function (clusters, _controller) {
                    $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'js/app/clusters/deployClustersModalTemplate.html',
                        controllerAs: '$ctrl',
                        controller: function ($uibModalInstance, clusters) {
                            this.clusters = clusters;
                            this.selectedClusters = [];
                            this.ok = function () {
                                $uibModalInstance.close(this.selectedClusters, _controller);
                            };
                            this.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'lg',
                        resolve: {
                            clusters: function () {
                                return clusters;
                            },
                            _controller: function () {
                                return self;
                            }
                        }
                    }).result.then(function (selectedClusters, _controller) {
                        console.log("selected clusters [%j]", selectedClusters);
                        Clusters.deployAll({}, {
                                clusters: selectedClusters
                            }).$promise
                            .then(_controller._loadClusters)
                            .catch(function (r) {
                                self._handleError('An error occurred  while deploying clusters: ' + JSON.stringify(r));
                                _controller._loadClusters();
                            });
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };

                self.openContainerInfoModal = function (clusterId, containerId) {
                    $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'js/app/clusters/containerInfoModal.html',
                        controllerAs: '$ctrl',
                        controller: function ($uibModalInstance, container) {
                            delete container.realizations;
                            delete container.anomalies;

                            this.container = container;
                            this.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                            this.isObject = function (value) {
                                return angular.isObject(value)
                            }
                        },
                        size: 'lg',
                        resolve: {
                            container: Clusters.getContainer({
                                key: clusterId,
                                containerId: containerId
                            })
                        }
                    }).result.then(function (selectedClusters) {
                        console.log('Modal dismissed at: ' + new Date());
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };

                self.openContainerAnomaliesModal = function (cluster, container) {
                    $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'js/app/clusters/containerAnomaliesModal.html',
                        controllerAs: '$ctrl',
                        controller: function ($uibModalInstance, anomalies) {
                            this.anomalies = anomalies;
                            this.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'lg',
                        resolve: {
                            anomalies: function () {
                                return Environment.getAnomalies(cluster, container);
                            }
                        }
                    }).result.then(function () {
                        console.log('Modal dismissed at: ' + new Date());
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };

                self.openContainerStatisticsModal = function (cluster, container) {
                    $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'js/app/clusters/containerStatisticsModal.html',
                        controllerAs: '$ctrl',
                        controller: function ($uibModalInstance, cluster, Environment, container) {
                            this.name = cluster;
                            this.chartOptionsBase = {
                                chart: {
                                    type: 'lineChart',
                                    height: 300,
                                    margin: {
                                        top: 20,
                                        right: 20,
                                        bottom: 80,
                                        left: 55
                                    },
                                    useInteractiveGuideline: true,
                                    showLegend: true,
                                    wrapLabels: true,
                                    tooltips: true,
                                    reduceXTicks: false,
                                    showDistY: true,
                                    showDistX: true,
                                    refreshDataOnly: true,
                                    xAxis: {
                                        showMaxMin: false
                                    },
                                    yAxis: {
                                        axisLabelDistance: -10,
                                        showMaxMin: false,
                                        tickFormat: function (d) {
                                            return d3.format('.02f')(d);
                                        }
                                    }
                                }
                            };

                            this.$onInit = function () {
                                var self = this;
                                this._buildChartsData();
                                this.interval = setInterval(function () {
                                    self._buildChartsData();
                                }, 5000);
                            }

                            this.cancel = function () {
                                clearInterval(this.interval);
                                $uibModalInstance.dismiss('cancel');
                            };

                            this._buildChartsData = function () {
                                var statistics = Environment.getStatistics(cluster, container);
                                this._defineCpuChart(statistics);
                                this._defineNetworkChart(statistics);
                                this._defineBlkioChart(statistics);
                                this._defineMemoryChart(statistics);
                            }

                            this._defineCpuChart = function (statistics) {
                                this.cpuOptions = angular.copy(this.chartOptionsBase);
                                this.cpuOptions.chart.yDomain = [0, 100];
                                this.cpuOptions.title = {
                                    enable: true,
                                    text: 'CPU (%)'
                                }
                                this.cpuDataset = [{
                                    key: 'Usage',
                                    values: statistics.map(function (obj, idx) {
                                        return {
                                            x: idx,
                                            y: (obj.cpu.current).toFixed(2)
                                        };
                                    })
                                }, {
                                    key: 'Allocated',
                                    values: statistics.map(function (obj, idx) {
                                        return {
                                            x: idx,
                                            y: obj.cpu.allocated ? (obj.cpu.allocated).toFixed(2) : 0
                                        };
                                    })
                                }];
                            };

                            this._defineNetworkChart = function (statistics) {
                                this.networkOptions = angular.copy(this.chartOptionsBase);
                                this.networkOptions.title = {
                                    enable: true,
                                    text: 'Network (MB/s)'
                                };
                                this.networkDataset = [{
                                    key: 'Rx',
                                    values: statistics.map(function (obj, idx) {
                                        return {
                                            x: idx,
                                            y: (obj.network.rx / 1000000).toFixed(2)
                                        };
                                    })
                                }, {
                                    key: 'Tx',
                                    values: statistics.map(function (obj, idx) {
                                        return {
                                            x: idx,
                                            y: (obj.network.tx / 1000000).toFixed(2)
                                        };
                                    })
                                }];
                            }

                            this._defineBlkioChart = function (statistics) {
                                this.blkioOptions = angular.copy(this.chartOptionsBase);
                                this.blkioOptions.title = {
                                    enable: true,
                                    text: 'BlokIO (MB/s)'
                                };
                                this.blkioDataset = [{
                                    key: 'Read',
                                    values: statistics.map(function (obj, idx) {
                                        return {
                                            x: idx,
                                            y: (obj.blkio.blkRead / 1000000).toFixed(2)
                                        };
                                    })
                                }, {
                                    key: 'Write',
                                    values: statistics.map(function (obj, idx) {
                                        return {
                                            x: idx,
                                            y: (obj.blkio.blkWrite / 1000000).toFixed(2)
                                        };
                                    })
                                }];
                            };

                            this._defineMemoryChart = function (statistics) {
                                this.memoryOptions = angular.copy(this.chartOptionsBase);
                                this.memoryOptions.title = {
                                    enable: true,
                                    text: 'Memory (GB)'
                                };
                                this.memoryDataset = [{
                                    key: 'Current',
                                    values: statistics.map(function (obj, idx) {
                                        return {
                                            x: idx,
                                            y: (obj.memory.current / 1000000000).toFixed(2)
                                        };
                                    })
                                }, {
                                    key: 'Allocated',
                                    values: statistics.map(function (obj, idx) {
                                        return {
                                            x: idx,
                                            y: (obj.memory.total / 1000000000).toFixed(2)
                                        };
                                    })
                                }];
                            };
                        },
                        size: '80-pct',
                        resolve: {
                            Environment: function () {
                                return Environment;
                            },
                            cluster: function () {
                                return cluster;
                            },
                            container: function () {
                                return container;
                            }
                        }
                    }).result.then(function (selectedClusters) {
                        console.log('Modal dismissed at: ' + new Date());
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                }

                self._loadClusters = function () {
                    Clusters.getAll()
                        .$promise.then(function (clusters) {
                            self.clusters = Object.values(clusters);
                            self.loading = false;
                            self.serverError = false;
                            var tagPromises = [];
                            Object.keys(self.clusters).forEach(function (clusterIndex) {
                                var cluster = self.clusters[clusterIndex];
                                if (cluster.containers) {
                                    let match = /^(?:.+?)\/(.*)/g.exec(cluster.containers[0].image);
                                    if (match) {
                                        var repo = match[1];
                                        Repositories.tags({
                                                key: repo
                                            })
                                            .$promise.then(function (tags) {
                                                cluster.tags = tags;
                                            }, function (e) {
                                                console.log("unable to find tags for image ", e)
                                            });
                                    }
                                }
                            });
                        })
                        .catch(function (e) {
                            console.log("error: ", e);
                            self.loading = false;
                            self.serverError = true;
                        });
                }

                self._handleError = function (msg) {
                    Bus.emit('general.error', msg.data || msg);
                }

                self._updateClusterState = function (e, msg) {
                    if (!self.clusters) {
                        return;
                    }
                    for (var i = 0; i < self.clusters.length; i++) {
                        var _cluster = self.clusters[i];
                        if (_cluster.name === msg.cluster) {
                            for (var j = 0; j < _cluster.containers.length; j++) {
                                var _container = _cluster.containers[j];
                                if (_container.id === msg.container) {
                                    _container.hasAnomalies = msg.hasAnomalies;
                                    _container.hasStatistics = msg.hasStatistics;
                                }
                            }
                        }
                    }
                    $scope.$apply();
                }

                self._registerListeners = function () {
                    Bus.listen('container.started', self._loadClusters);
                    Bus.listen('container.stopped', self._loadClusters);
                    Bus.listen('container.removed', self._loadClusters);
                    Bus.listen('container.update', self._updateClusterState);
                }
            }
        ]
    });
