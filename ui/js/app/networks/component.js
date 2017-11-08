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
    .module('networks')
    .component('networks', {
        templateUrl: 'js/app/networks/template.html',
        controller: ['Networks', '$uibModal',
            function NetworksController(Networks, $uibModal) {
                var self = this;

                self.$onInit = function() {
                    self.loading = true;
                    self._loadNetworks();
                };

                self.length = function(obj) {
                    return Object.keys(obj).length;
                };

                self.deleteNetwork = function(networkId) {
                    if (confirm("Removing " + networkId)) {
                        Networks.remove({
                                key: networkId
                            }).$promise
                            .then(self._loadNetworks)
                            .catch(console.log);
                    }
                };

                self.openNetworkInfoModal = function(networkId) {
                    $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'js/app/networks/networkInfoModal.html',
                        controllerAs: '$ctrl',
                        controller: function($uibModalInstance, network) {
                            this.network = network;
                            this.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                            this.isObject = function(value) {
                                if (angular.isObject(value)) {
                                    return Object.keys(value).length > 0;
                                }
                                return false;
                            }
                        },
                        size: 'lg',
                        resolve: {
                            network: Networks.info({
                                key: networkId
                            })
                        }
                    }).result.then(function() {
                        console.log('Modal dismissed at: ' + new Date());
                    }, function() {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };

                self._loadNetworks = function() {
                    Networks.get()
                        .$promise.then(function(networks) {
                            self.networks = networks;
                            self.loading = false;
                        })
                        .catch(console.log);
                }
            }
        ]
    });