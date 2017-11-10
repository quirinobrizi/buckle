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

const RealizationReceiver = require('./RealizationReceiver');
const EventsReceiver = require('./EventReceiver');
const logger = require('../Logger');

module.exports = class EnvironmentMonitor {

    constructor(eventEmitter, containerRepository, eventRepository, environmentService, anomalyAnalyzer) {
        this.eventEmitter = eventEmitter;
        this.containerRepository = containerRepository;
        this.eventRepository = eventRepository;
        this.anomalyAnalyzer = anomalyAnalyzer;
        this.environmentService = environmentService;
        this.listeners = [];
        this.containers = [];

        this.eventRepository.get(new EventsReceiver(this.eventEmitter), console.error);
    }

    close() {
        this.listeners.forEach(listener => {
            listener.close();
        });
    }

    registerListeners(listeners) {
        var self = this;
        listeners.forEach(listener => {
            var Listener = require(listener);
            var _listener = new Listener(self.eventEmitter, self.anomalyAnalyzer);
            _listener.register();
            self.listeners.push(_listener);
        });
    }

    monitor() {
        var self = this;
        this._registerEventListeners();
        this.containerRepository.getAll()
            .then(containers => {
                containers.forEach(container => {
                    if (!container.getName().includes("swarm-agent")) {
                        self._listenForRealizationOnContainer(container);
                    }
                });
            })
            .catch(logger.error);
    }

    _registerEventListeners() {
        var self = this;
        this.eventEmitter.on('container.start', event => {
            self.containerRepository.getContainer(event.getId())
                .then(self._listenForRealizationOnContainer)
                .catch(function(e) {
                    logger.warn("unable to add new container to realization listener", e);
                })
        });
        this.eventEmitter.on('container.destroy', event => {
            self._updateRealizationCollector();
        });
    }

    _listenForRealizationOnContainer(container) {
        if (!this.environmentService.alreadyObserves(container)) {
            logger.log("adding [%s] [%s] for realization collection", container.getName(), container.getContainerId());
            this.containerRepository
                .registerRealizationListener(container.getContainerId(), new RealizationReceiver(this.eventEmitter), console.error);
        }
    }

    _updateRealizationCollector() {
        var self = this;
        this.containerRepository.getAll()
            .then(containers => {
                self.environmentService.removeOrphans(containers);
            })
            .catch(logger.error);
    }
};
