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

const SwarmApiBuilder = require('./swarm-api-builder');
const NodeApiBuilder = require('./node-api-builder');
const ImageApiBuilder = require('./image-api-builder');
const RepositoryApiBuilder = require('./repository-api-builder');
const VolumeApiBuilder = require('./volume-api-builder');
const NetworkApiBuilder = require('./network-api-builder');
const PluginsApiBuilder = require('./plugin-api-builder');

module.exports = {

    apiBuilders : function(dockerEngineClient, dockerRegistryClient, eventEmitter) {
        return [ new PluginsApiBuilder(dockerEngineClient, dockerRegistryClient, eventEmitter),
                new NetworkApiBuilder(dockerEngineClient, dockerRegistryClient, eventEmitter),
                new VolumeApiBuilder(dockerEngineClient, dockerRegistryClient, eventEmitter),
                new SwarmApiBuilder(dockerEngineClient, dockerRegistryClient, eventEmitter),
                new NodeApiBuilder(dockerEngineClient, dockerRegistryClient, eventEmitter),
                new ImageApiBuilder(dockerEngineClient, dockerRegistryClient, eventEmitter),
                new RepositoryApiBuilder(dockerEngineClient, dockerRegistryClient, eventEmitter) ];
    }
};
