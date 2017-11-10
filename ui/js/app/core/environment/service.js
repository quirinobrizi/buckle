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

angular.module('core.environment').service('Environment', ['Bus', function (Bus) {

    var containers = {};

    var init = function () {
        console.log("initialize environment listener");
        Bus.listen('container.updated', function (e, container) {
            if (!containers[container.id]) {
                containers[container.id] = {
                    cluster: container.name,
                    container: container.id,
                    hasStatistics: container.statistics !== undefined,
                    hasAnomalies: container.anomalies !== undefined,
                    statistics: container.statistics,
                    anomalies: container.anomalies
                };
            } else {
                containers[container.id].hasStatistics = container.realizations && container.realizations.length > 0;
                containers[container.id].statistics = container.realizations;
                containers[container.id].hasAnomalies = container.anomalies && container.anomalies.length > 0;
                containers[container.id].anomalies = container.anomalies;
            }
            Bus.emit('container.update', containers[container.id]);
        });
    };

    this.destroy = function () {
        Bus.remove('container.updated');
    };

    init();

    return {
        getStatistics: function (cluster, container) {
            return containers[container].statistics.sort(function(a,b){ return a.timestamp - b.timestamp; });
        },

        getAnomalies: function (cluster, container) {
            return containers[container].anomalies;
        },

        getContainers: function () {
            return containers;
        }
    }
}]);
