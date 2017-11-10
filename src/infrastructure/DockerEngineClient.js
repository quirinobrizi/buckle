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

const request = require('request');
const util = require('util');
const wait = require('wait-promise');
const logger = require('./Logger');

const DockerEngineException = require('./exception/DockerEngineException');

module.exports = class DockerEngineClient {

    constructor(configuration, eventEmitter, cache) {
        var self = this;
        this.eventEmitter = eventEmitter;
        this.uri = configuration.docker.engine.uri;
        this.ca = configuration.docker.engine.ca;
        this.cert = configuration.docker.engine.cert;
        this.key = configuration.docker.engine.key;
        this.registryAuthentication = new Buffer(JSON.stringify({
            "username": configuration.docker.registry.username,
            "password": configuration.docker.registry.password,
            "email": configuration.docker.registry.email,
            "serveraddress": configuration.docker.registry.uri.replace(/http[s]:\/\//, '')
        })).toString("base64");
        this.system = null;
        this.version().then(v => {
            self.system = v;
            console.log("Version %s", JSON.stringify(this.system));
        }).catch(e => {
            self.system = null;
        });
        self.cache = cache;
    }

    // CONTAINERS

    listContainers() {
        return this._invoke(
            this._options(this._url("containers/json"), 'GET', {
                all: true
            }),
            'containers.listed'
        );
    }

    inspectContainer(container) {
        return this._invoke(
            this._options(this._url(util.format("containers/%s/json", container))),
            'containers.inspected'
        );
    }

    stopContainer(container) {
        console.log("Requested to stop [%s]", container);
        return this._invoke(
            this._options(this._url(util.format("containers/%s/stop?t=30", container)), 'POST', {
                t: 20
            }, null),
            'containers.stopped'
        );
    }

    startContainer(container) {
        return this._invoke(
            this._options(this._url(util.format("containers/%s/start", container)), 'POST'),
            'containers.started'
        );
    }

    removeContainer(container) {
        return this._invoke(
            this._options(this._url(util.format("containers/%s", container)), 'DELETE', {
                force: true,
                v: false,
                link: false
            }, null),
            'containers.removed'
        );
    }

    waitForContainer(container) {
        return this._invoke(this._options(this._url(util.format("containers/%s/wait", container)), 'POST'));
    }

    containerRealization(container, success, error) {
        request.get(this._url(util.format("containers/%s/stats", container)), this._options(null, 'GET', {
                stream: true
            }, null))
            .on('error', error)
            .pipe(success);
    }

    containerLogs(container) {
        return this._invoke(this._options(this._url("containers/%s/logs?tail=25&stdout=true&stderr=true", container)), null);
    }

    /**
     * Update resource configurations of a container.
     */
    updateContainer(container, updates) {
        logger.info("updating container %s with config %s", container, JSON.stringify(updates));
        return this._invoke(this._options(this._url(util.format("containers/%s/update", container)), 'POST', {}, updates));
    }

    /**
     * Convenient method allows to delete a container, the action taken are: -
     * Stop container - Wait for container to stop - Remove container
     *
     * @method deleteContainer
     * @param {string}
     *            container Identifier of the container to remove
     * @return {Promise} A Promise fulfilled at the end if the process
     */
    deleteContainer(container) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.stopContainer(container).then(r => {
                logger.info("container %s stopped, response [%j]", container, r);
                self.removeContainer(container).then(r => {
                    resolve(util.format("container %s deleted", container));
                }).catch(reject);
            }).catch(reject);
        });
    }

    createContainer(config, name) {
        return this._invoke(
            this._options(this._url("containers/create"), 'POST', {
                name: name
            }, config),
            'containers.created'
        );
    }

    getContainersByName(name) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.listContainers().then(containers => {
                var targets = containers.filter(function (container) {
                    var containerMatch = /\/(.*)\/(?:[a-zA-Z0-9]+_){0,1}([a-zA-Z0-9-]+)/g.exec(container.Names[0]);
                    if (!containerMatch) {
                        containerMatch = /.*_(.*)_.*/g.exec(container.Names[0]);
                    }
                    var getName = containerMatch[2] || containerMatch[1];
                    logger.debug("comparing current [%s] and requested [%s]", getName, name);
                    return getName === name;
                });
                resolve(targets);
            }).catch(reject);
        });
    }

    /**
     * Deploy or scale the required container
     *
     * @method deployOrScaleContainer
     * @param {objetc}
     *            config The container configuration
     * @param {string}
     *            name The container name
     * @param {string}
     *            image the identifier for the image to use
     * @param {number}
     *            cardinality The target number of containers
     * @param {boolean}
     *            recreate A flag indicating whether to recrete containers
     * @return {Promise} A promise
     */
    deployOrScaleContainer(config, name, image, cardinality, recreate, startBeforeDelete) {
        var self = this;
        var project = self._makeid();
        return new Promise(function (resolve, reject) {
            self.listContainers().then(containers => {
                logger.info("Filtering containers started from image [%s]", image);
                var targets = containers.filter(function (container) {
                    var containerImage = /([^:]*):?(.*)$/g.exec(container.Image)[1];
                    logger.info("evaluating container image [%j]", containerImage);
                    return containerImage === image;
                });
                // arder containers by crete date ascending
                targets.sort(function (a, b) {
                    return a.Created - b.Created;
                });
                logger.debug("target containers [%j]", targets);

                var runningContainers = targets.length;
                logger.info("found %s containers already running, requested %s to be run", runningContainers, cardinality);
                if (runningContainers > 0) {
                    var started = 0;
                    if (cardinality < runningContainers) {
                        logger.info("Found %s containers that need to be stopped", runningContainers - cardinality);
                        Array(runningContainers - cardinality).fill().map((_, i) => {
                            var position = cardinality + i;
                            logger.info("removing container at position [%s]", position);
                            var target = targets.splice(position, 1)[0];
                            logger.info("stopping container %s [%s]", target.Id, target.Names[0]);
                            self.deleteContainer(target.Id).then(r => {
                                logger.info("container %s stopped", target.Id);
                                if (!recreate && targets.length === cardinality) {
                                    resolve({
                                        message: "done"
                                    });
                                }
                            }).catch(reject);
                        });
                    } else if (cardinality > runningContainers) {
                        logger.info("Requested to start %s additional container(s)", (cardinality - runningContainers));
                        Array(cardinality - runningContainers).fill().map((_, i) => {
                            var getName = util.format("%s_%s_%s", project, name, (runningContainers + (i + 1)));
                            logger.info('creating container %s with config: %s', getName, JSON.stringify(config));
                            self.createContainer(config, getName).then(newContainer => {
                                self.startContainer(newContainer.Id).then(r => {
                                    logger.info("new container started: ", newContainer.Id);
                                    if (!recreate && targets.length + i + 1 === cardinality) {
                                        resolve({
                                            message: "done"
                                        });
                                    }
                                }).catch(reject);
                            }).catch(reject);
                        });
                    }
                    logger.info('* * should recreate? %s', recreate);
                    if (recreate) {
                        self._recreateContainer(targets, project, config, startBeforeDelete).then(resolve).catch(reject);
                    }
                } else {
                    Array(cardinality).fill().map((_, i) => {
                        var getName = util.format("%s_%s_%s", project, name, (i + 1));
                        logger.info('creating container %s with config [%j]', getName, config);
                        self.createContainer(config, getName).then(newContainer => {
                            self.startContainer(newContainer.Id).then(r => {
                                logger.info("new container started: ", newContainer.Id);
                                if (i + 1 === cardinality) {
                                    resolve({
                                        message: "done"
                                    });
                                }
                            }).catch(reject);
                        }).catch(reject);
                    });
                }
            }).catch(reject);
        });
    }

    // IMAGES

    listImages() {
        return this._invoke(
            this._options(this._url("images/json")),
            'images.listed'
        );
    }

    inspectImage(image) {
        return this._invoke(
            this._options(this._url(util.format("images/%s/json", image))),
            'images.inspected'
        );
    }

    pullImage(image, tag) {
        return this._invoke(
            this._options(this._url("images/create"), 'POST', {
                fromImage: image,
                tag: tag
            }),
            'images.pulled'
        );
    }

    getImageHistory(image) {
        return this._invoke(
            this._options(this._url(util.format("images/%s/history", image))),
            'images.history'
        );
    }

    // SWARM

    getSwarm() {
        return this._invoke(
            this._options(this._url("swarm")),
            'swarm.listed'
        );
    }

    // NODES

    listNodes() {
        return this._invoke(
            this._options(this._url("nodes")),
            'nodes.listed'
        );
    }

    inspectNode(nodeId) {
        return this._invoke(
            this._options(this._url(util.format("nodes/%s", nodeId))),
            'nodes.inspected'
        );
    }

    // VOLUMES

    listVolumes() {
        return this._invoke(
            this._options(this._url("volumes"), "GET", {
                dangling: false
            }, null),
            'volumes.listed'
        );
    }

    // SYSTEM

    queryInfo() {
        return this._invoke(this._options(this._url("info"), "GET", {}, null), null);
    }

    // NETWORKS

    listNetworks() {
        return this._invoke(this._options(this._url("networks"), "GET", {}, null), 'network.listed');
    }

    removeNetwork(networkId) {
        return this._invoke(
            this._options(this._url(util.format("networks/%s", networkId)), "DELETE", {}, null),
            'networks.removed'
        );
    }

    inspectNetwork(networkId) {
        return this._invoke(
            this._options(this._url(util.format("networks/%s", networkId)), "GET", {}, null),
            'networks.inspected'
        );
    }

    // PLUGINS

    listPlugins() {
        return this._invoke(this._options(this._url("plugins"), "GET", {}, null), 'plugins.listed');
    }

    // events

    events(since, success, error) {
        console.log("listen for events");
        request.get(this._url("events"), this._options(null, 'GET', {
                since: since
            }, null))
            .on('error', error)
            .pipe(success);
    }

    // Tasks
    // A task is a container running on a swarm. It is the atomic scheduling unit of swarm. Swarm mode must be enabled for these endpoints to work.

    /**
     * List tasks running on this swarm environment
     * @return {Promise} a promise resolved with the list of tasks running on this swarm environment.
     */
    listTasks() {
        return this._invoke(this._options(this._url("tasks"), "GET", {}, null));
    }

    /**
     * Inspect a task running on this swarm environment
     * @param  {string} taskId The task identifier
     * @return {Promise} a promise resolved with the list of tasks running on this swarm environment.
     */
    inspectTask(taskId) {
        return this._invoke(this._options(this._url(util.format("tasks/%s", taskId)), "GET", {}, null));
    }

    // MISC
    version() {
        return this._invoke(this._options(this._url("version"), "GET", {}, null));
    }

    // Execution methods

    _url(path) {
        var v = null; // this._apiVersion();
        var url = null;
        if (v) {
            url = util.format("%s/%s/%s", this.uri, v, path)
        } else {
            url = util.format("%s/%s", this.uri, path)
        }
        // console.log("target URL [%s]", url);
        return url;
    }

    _apiVersion() {
        if (this.system) {
            return this.system.ApiVersion;
        }
        return null;
    }

    _invoke(options, _event) {
        var self = this;
        return new Promise(function (resolve, reject) {
            let data = self.cache.get(options.url);
            if (data) {
                logger.debug("cache hit for %s", options.url);
                return resolve(data);
            } else {
                request(
                    options,
                    function (e, r, b) {
                        try {
                            let answer = self._handler(e, r, b);
                            self.cache.set(options.url, answer);
                            resolve(answer);
                        } catch (e) { reject(e); }
                    });
            }
        });
    }

    _handler(e, r, b) {
        // console.log("handling response from docker engine. Error: [%j]
        // Response:
        // [%j] Body: [%j]", e,r,b);
        var statusCode = r ? r.statusCode || 500 : 500;
        if (e || [200, 201, 202, 204, 304].indexOf(statusCode) < 0) {
            logger.error("Received error from docker engine: ", statusCode, e || b);
            // TODO: QB handle 500 device or resource busy as a success.?
            if (!e && 'string' === typeof b) {
                b = {
                    message: b
                };
            }
            throw new DockerEngineException(statusCode, e, b);
        }
        return b;
    }

    /**
     * Prepare the HTTP request options
     * @param  {string} url    the URL of the resource to contact
     * @param  {string} method The HTTP method
     * @param  {Object} qs     The query string parameters as a object
     * @param  {Object} body   The request body to send to the target URL
     * @return {object}        The request options
     */
    _options(url, method, qs, body) {
        return {
            url: url,
            json: true,
            headers: {
                'X-Registry-Auth': this.registryAuthentication,
                'Accept': "application/json",
                'User-Agent': "Buckle"
            },
            qs: qs || {},
            body: body,
            method: method || 'GET',
            cert: this.cert,
            ca: this.ca,
            key: this.key,
            agentOptions: {
                securityOptions: 'SSL_OP_NO_SSLv3'
            }
        };
    }

    _makeid() {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    _recreateContainer(targets, project, config, deleteFirst) {
        var self = this;
        return new Promise((resolve, reject) => {
            targets.forEach((target, idx) => {
                logger.info("replacing container %s [%s]", target.Id, target.Names[0]);
                var getName = util.format("%s_%s", project, /.*\/(?:[a-zA-Z0-9]+_){0,1}([a-zA-Z0-9-_]+)/.exec(target.Names[0])[1]);
                logger.info('creating container %s with config %s', getName, JSON.stringify(config));
                if (deleteFirst) {
                    self.deleteContainer(target.Id).then(r => {
                        logger.info('container [%s] deleted', target.Id);
                        self.createContainer(config, getName).then(newContainer => {
                            logger.info('new container %s created, starting it', newContainer.Id);
                            self.startContainer(newContainer.Id).then(r => {
                                // TODO: QB need health check the service
                                // running on the
                                // container
                                console.log("new container started [%s]", newContainer.Id, target.Id);
                                if (targets.length === idx + 1) {
                                    resolve({
                                        message: "done"
                                    });
                                }
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                } else {
                    self.createContainer(config, getName).then(newContainer => {
                        logger.info('new container %s created, starting it', newContainer.Id);
                        self.startContainer(newContainer.Id).then(r => {
                            // TODO: QB need health check the service running on
                            // the container
                            logger.info("new container started [%s], waiting 60 seconds before removing [%s]", newContainer.Id, target.Id);
                            wait.sleep(60000).then(function () {
                                self.deleteContainer(target.Id).then(r => {
                                    console.log('container [%s] deleted', target.Id);
                                    if (targets.length === idx + 1) {
                                        resolve({
                                            message: "done"
                                        });
                                    }
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }
            });
        });
    }

};
