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
  .module('core.cluster')
  .factory('Clusters', ['$resource',
    function($resource) {
      return $resource('/buckle/rest/clusters/:key', {}, {
        'getAll': {
          method: 'GET',
          url: '/buckle/rest/clusters'
        },
        'deployAll': {
          method: 'POST',
          url: '/buckle/rest/clusters'
        },
        'deploy': {
          method: 'POST',
          url: '/buckle/rest/clusters/:key',
          params: { key: '@key' }
        },
  		  'remove': {
  			  method: 'DELETE',
          url: '/buckle/rest/clusters/:key',
  			  isArray: false,
          params: { key: '@key' }
  		  },
        'scale': {
          method: 'PUT',
          url: '/buckle/rest/clusters/:key',
          params: { key: '@key' }
        },
        'getContainer': {
          method: 'GET',
          url: '/buckle/rest/clusters/:key/containers/:containerId',
          params: { key: '@key', containerId: '@containerId' }
        },
        'removeContainer': {
          method: 'DELETE',
          url: '/buckle/rest/clusters/:key/containers/:containerId',
          params: { key: '@key', containerId: '@containerId' }
        },
        'getContainerLogs': {
          method: 'GET',
          url: '/buckle/rest/clusters/:key/containers/:containerId/logs',
          params: { key: '@key', containerId: '@containerId' },
          isArray: true
        }
      });
    }
]);
