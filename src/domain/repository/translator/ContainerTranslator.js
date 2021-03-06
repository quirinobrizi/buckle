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

const Container = require('../../model/Container');
const NodeTranslator = require('./NodeTranslator');

const containerHelper = require('../../../infrastructure/helper/ContainerHelper');

module.exports = class ContainerTranslator {
    constructor() {
        this.nodeTranslator = new NodeTranslator();
    }

    translate(container) {
        return new Container(container.Id,
            containerHelper.extractContainerName(container),
            containerHelper.extractContainerImage(container))
                .setHostConfig(container.HostConfig)
                .setConfig(container.Config)
                .setNetworkSettings(container.NetworkSettings)
                .setState(this._extractState(container.State))
                .setStatus(container.Status || container.State.Status)
                .setNode(this._extractNode(container))
                .setCreatedTimestamp(typeof container.Created === 'string' ? Date.parse(container.Created) : container.Created * 1000);
    }

    _extractState(state) {
        if (typeof state === 'string') {
            return state;
        }
        return "";
    }

    _extractNode(container) {
        if (container.Node) {
            return container.Node.ID || container.Node.Name
        } else {
            var name = container.Name;
            if (!name) {
                name = container.Names[0];
            }
            var containerMatch = /\/(.*)\/(?:[a-zA-Z0-9]+_){0,1}([a-zA-Z0-9-]+)/g.exec(name);
            return containerMatch ? containerMatch[1] : null;
        };
    }
}
