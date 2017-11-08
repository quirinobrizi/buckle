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
  .module('container')
  .component('container', {
    templateUrl: 'js/app/container/template.html',
    controller: ['Clusters', '$routeParams',
      function ContainerController(Clusters, $routeParams) {
        var self = this;
        var containerId = $routeParams.containerId;
        var clusterId = $routeParams.clusterId;
        self.container = Clusters.getContainer({key: clusterId, containerId:containerId});
        // Clusters.getContainerLogs({key: clusterId, containerId: containerId}, logs => {self.logs = logs;}, err => {self.logs = [err]});

        self.splitOnUppercase = function(key) { return key.split(/(?=[A-Z])/).join(' '); }
        self.isObject = function (value) { return angular.isObject(value) }
      }
    ]
  });
