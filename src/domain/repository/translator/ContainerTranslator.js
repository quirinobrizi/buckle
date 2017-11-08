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

module.exports = class ContainerTranslator {
    constructor() {
        this.nodeTranslator = new NodeTranslator();
    }

    translate(container) {
        var answer = new Container(container.Id, this._extractName(container), container.Image);
        answer.setHostConfig(container.HostConfig)
            .setConfig(container.Config)
            .setNetworkSettings(container.NetworkSettings)
            .setState(this._extractState(container.State))
            .setStatus(container.Status || container.State.Status)
            .setNode(this.nodeTranslator.translate(container.Node))
            .setCreatedTimestamp(typeof container.Created === 'string' ?  Date.parse(container.Created) : container.Created * 1000);
        return answer;
    }

    _extractState(state) {
        if(typeof state === 'string') {
            return state;
        }
        return "";
    }

    _extractName(container) {
        var name = container.Name;
        if (!name) {
            name = container.Names[0];
        }
        var containerMatch = /\/(.*)\/(?:[a-zA-Z0-9]+_){0,1}([a-zA-Z0-9-]+)/g.exec(name);
        if (!containerMatch) {
            containerMatch = /.*_(.*)_.*/g.exec(name);
        }
        if(!containerMatch) {
            containerMatch = /\/(.*)\.\d+\..*/g.exec(name)
        }
        return containerMatch ? containerMatch[2] || containerMatch[1] : name.replace(/^\//, '');
    }
}