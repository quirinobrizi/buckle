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

angular.module('statistics').component('statistics', {
    templateUrl: 'js/app/statistics/template.html',
    controller: ['Environment', 'Bus', '$scope', function StatisticsController(Environment, Bus, $scope) {
        var self = this;
        var lastUpdate = 0;

        self.chartOptionsBase = {
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
                showLegend: false,
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

        self.$onInit = function () {
            self.loading = true;
            self.datasets = {
                cpu: [],
                memory: []
            };
            self.options = self._buildOptions();
            Bus.listen('container.update', self._buildChartsData)
        }

        self.$onDestroy = function () {
            Bus.remove('container.update');
        }

        self._buildChartsData = function () {
            var now = Date.now();
            if (now - lastUpdate < 1000) {
                return false;
            }
            lastUpdate = now;
            var containers = Environment.getContainers();
            if (!containers) {
                return false;
            }
            self.datasets = self._buildDatasets(Object.values(containers));
            if (self.loading) {
                self.loading = false;
            }

            // this._defineNetworkChart(statistics);
            // this._defineBlkioChart(statistics);
        }

        self._buildDatasets = function (containers) {
            return {
                cpu: containers.map(function (container) {
                    return {
                        key: container.cluster,
                        values: container.statistics.map(function (obj, idx) {
                            return {
                                x: idx,
                                y: (obj.cpu.current).toFixed(2)
                            };
                        })
                    }
                }),
                memory: containers.map(function (container) {
                    return {
                        key: container.cluster,
                        values: container.statistics.map(function (obj, idx) {
                            return {
                                x: idx,
                                y: (obj.memory.current / 1000000000).toFixed(2)
                            };
                        })
                    }
                })
            };
        }

        self._buildOptions = function () {
            var cpuOptions = angular.copy(self.chartOptionsBase);
            cpuOptions.title = {
                enable: true,
                text: 'CPU Usage (%)'
            };
            cpuOptions.chart.lines = { // for line chart
                forceY: [0, 100]
            };
            var memoryOptions = angular.copy(self.chartOptionsBase);
            memoryOptions.title = {
                enable: true,
                text: 'Memory (GB)'
            };
            memoryOptions.chart.lines = { // for line chart
                forceY: [0, 10] // should be the max on node + tollerance
            };
            return {
                cpu: cpuOptions,
                memory: memoryOptions
            }
        }
    }]
});
