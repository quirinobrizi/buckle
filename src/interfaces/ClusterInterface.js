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

const apiHelper = require('./api/api-helper');

module.exports = class ClusterInterface {

    constructor(containerService, clusterTranslator, containerMessageTranslator) {
        this.containerService = containerService;
        this.clusterTranslator = clusterTranslator;
        this.containerMessageTranslator = containerMessageTranslator;
    }

    buildApis(router) {
        var self = this;

        router.get('/clusters', function(req, res) {
            self.containerService.getAllContainers()
                .then(containers => {
                    var clusters = self.clusterTranslator.translate(containers);
                    res.status(200).json(clusters);
                }).catch(e => {
                    apiHelper.handleApiError(e, req, res);
                });
        });

        /**
         * Deploy clusters of containers.
         *
         * @type {function}
         * @param body
         *          the deploy request payload containing the clusters to deploy
         *          as a array of cluster object. I.e. { "clusters": [ { "tag":
         *          "1.3.4", "name": "mongodb" } ] }
         */
        router.post('/clusters', function(req, res) {
            var clusters = req.body.clusters || [];
            var response = self.containerService.deploy(clusters).then(response => {
                res.status(200).json(response);
            }).catch(e => {
                apiHelper.handleApiError(e, req, res);
            });
        });

        /**
         * Deploy a cluster
         */
        router.post('/clusters/:clusterId', function(req, res) {
            var response = self.containerService.deploy([{
                tag: req.body.tag || 'latest',
                name: req.params.clusterId
            }]).then(response => {
                res.status(200).json(response);
            }).catch(e => {
                apiHelper.handleApiError(e, req, res);
            });
        });

        /**
         * Scale a cluster of containers increasing or decreasing its
         * cardinality by the provided amount.
         *
         * @method Scale containers cluster
         * @param {string}
         *          clusterId The cluster identifier
         * @param {object}
         *          body the information needed to scale the cluster, i.e. {
         *          'image': '[privare_repo/organization/]mongodb', 'tag':
         *          '3.0.1', 'cardinality': 3 }
         */
        router.put('/clusters/:clusterId', function(req, res) {
            self.containerService.scale({
                name: req.params.clusterId,
                cardinality: parseInt(req.body.cardinality || 1, 10),
                tag: req.body.tag || 'latest'
            }).then(scaled => {
                if(scaled) {
                    res.status(200).json( { message: "cluster scaled" } );
                } else {
                    res.status(400).json({ message: "unable to scale cluster" });
                }
            }).catch(e => {
                apiHelper.handleApiError(e, req, res);
            });
        });

        /**
         * Stop and remove a container from a cluster
         *
         * @method Delete Container
         * @param {string}
         *          container The container identifier
         */
        // router.delete('/clusters/:clusterId', function (req,
        // res) {
        // var clusterId = req.params.clusterId;
        // self.dockerEngineClient.getContainersByName(clusterId).then(containers
        // => {
        // containers.forEach((container, idx) => {
        // self.dockerEngineClient.deleteContainer(container.Id).then(r => {
        // if (idx == containers.length) {
        // apiHelper.handleSuccess(self.eventEmitter, res, util.format('cluster
        // [%s] deleted', clusterId), r);
        // }
        // }).catch(e => { apiHelper.handleError(self.eventEmitter, e, req,
        // res); });
        // });
        // }).catch(e => { apiHelper.handleError(self.eventEmitter, e, req,
        // res); });
        // });
        //
        router.get('/clusters/:clusterId/containers/:containerId', function(req, res) {
            self.containerService.get(req.params.containerId).then(container => {
                res.send(self.containerMessageTranslator.translate(container));
            }).catch(e => {
                apiHelper.handleApiError(e, req, res);
            });
        });

        router.delete('/clusters/:clusterId/containers/:containerId', function(req, res) {
            self.containerService.deleteContainer(req.params.containerId).then(container => {
                res.status(200).json(container);
            }).catch(e => {
                apiHelper.handleApiError(e, req, res);
            });
        });

        // router.get('/clusters/:clusterId/containers/:containerId/logs',
        // authentication, function (req, res) {
        // self.dockerEngineClient.containerLogs(req.params.getContainerId).then(function
        // (logs) {
        // res.send(logs.split('\n').map((line) => {
        // return line.replace(/([^a-zA-Z0-9\{\}\[\]\s:\/_=:\+\-#\'\'<>,]+)/g,
        // '');
        // }));
        // }).catch(e => { apiHelper.handleError(self.eventEmitter, e, req,
        // res); });
        // });
    }
};
