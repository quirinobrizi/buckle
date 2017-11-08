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

const apiHelper = require('./api-helper');

module.exports = class NetworkApiBuilder {
  constructor(dockerEngineClient, dockerRegistryClient, eventEmitter) {
    this.dockerRegistryClient = dockerRegistryClient;
    this.dockerEngineClient = dockerEngineClient;
    this.eventEmitter = eventEmitter;
  }

  buildApis(router) {
    var self = this;

    router.get('/networks', function(req, res) {
      self.dockerEngineClient.listNetworks().then(function(answer) {
        apiHelper.handleSuccess(self.eventEmitter, res, "Networks information lodaded", answer);
      }).catch(e => {
        apiHelper.handleError(self.eventEmitter, e, req, res);
      });
    });

    router.get('/networks/:networkId', function(req, res) {
      self.dockerEngineClient.inspectNetwork(req.params.networkId).then(function(answer) {
        apiHelper.handleSuccess(self.eventEmitter, res, "Network information lodaded", answer);
      }).catch(e => {
        apiHelper.handleError(self.eventEmitter, e, req, res);
      });
    });

    router.delete('/networks/:networkId', function(req, res) {
      self.dockerEngineClient.removeNetwork(req.params.networkId).then(function(answer) {
        apiHelper.handleSuccess(self.eventEmitter, res, "Network deleted", answer);
      }).catch(e => {
        apiHelper.handleError(self.eventEmitter, e, req, res);
      });
    });
  }
};