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

var ContainerMessageTranslator = require('../../translator/ContainerMessageTranslator');

module.exports = class CometdListener {

    constructor(eventEmitter, anomalyAnalyzer) {
        this.eventEmitter = eventEmitter;
        this.eventEmitTimes = {};
        this.emitInterval = 1;
        this.containerMessageTranslator = new ContainerMessageTranslator();
    }

    register() {
        var self = this;
        this.eventEmitter.on('containers.updated', containers => {
            //console.log("updated %s contaners, sending notification", JSON.stringify(containers));
            for (var i = 0; i < containers.length; i++) {
                let container = containers[i];
                self._emitAsEvent('container.updated', this.containerMessageTranslator.translate(container));
            }
        });
        // this.eventEmitter.on('container.anomalies.detected', container => {
        // self._emitAsEvent('container.anomalies.detected',
        // this.containerMessageTranslator.translate(container));
        // });
        this.eventEmitter.on('container.started', msg => {
            self._emitAsEvent('container.started', msg);
        });
        this.eventEmitter.on('container.removed', msg => {
            self._emitAsEvent('container.removed', msg);
        });
        this.eventEmitter.on('container.stopped', msg => {
            self._emitAsEvent('container.stopped', msg);
        });
    }

    close() {

    }

    _emitAsEvent(_event, msg) {
        var lastEmitTime = this.eventEmitTimes[_event];
        var emit = !lastEmitTime ? true : (Date.now() - lastEmitTime) >= this.emitInterval;
        if (emit) {
            this.eventEmitTimes[_event] = Date.now();
            this.eventEmitter.emit('event', {
                type: _event,
                payload: msg
            });
        }
    }
};
