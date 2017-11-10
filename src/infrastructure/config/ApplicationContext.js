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

const awilix = require('awilix');
const EventEmitter = new require('events').EventEmitter;
const NanoCache = require('nano-cache');

const EnvironmentMonitor = require('../ai/EnvironmentMonitor');
const AnomalyAnalyzer = require('../ai/anomaly/AnomalyAnalyzer');
const RestRoutesBuilder = require('../../interfaces/RestRoutesBuilder');
const DockerRegistryClient = require('../DockerRegistryClient');
const DockerEngineClient = require('../DockerEngineClient');
const RealizationTranslator = require('../../interfaces/translator/RealizationTranslator');
const EnvironmentService = require('../../application/EnvironmentService');
const EnvironmentInterface = require('../../interfaces/EnvironmentInterface');
const ContainerRepository = require('../../domain/repository/ContainerRepository');
const EventRepository = require('../../domain/repository/EventRepository');
const ContainerTranslator = require('../../domain/repository/translator/ContainerTranslator');
const AnomalyService = require('../../application/AnomalyService');
const AnomalyInterface = require('../../interfaces/AnomalyInterface');
const ClusterInterface = require('../../interfaces/ClusterInterface');
const IdentityInterface = require('../../interfaces/IdentityInterface');
const ContainerService = require('../../application/ContainerService');
const ContainerMessageTranslator = require('../translator/ContainerMessageTranslator');
const ClusterTranslator = require('../../interfaces/translator/ClusterTranslator');
const UserRepository = require('../../domain/repository/UserRepository');
const EnvironmentRepository = require('../../domain/repository/EnvironmentRepository');

module.exports = {

    load: function(config) {

        var container = awilix.createContainer({
            resolutionMode: awilix.ResolutionMode.CLASSIC
        });

        var nanoCache = new NanoCache({
            ttl: config.buckle.cache.ttl || 30000,
            bytes: config.buckle.cache.buckle || 100000
        });

        container.register({
            eventEmitter: awilix.asClass(EventEmitter).singleton(),
            anomalyAnalyzer: awilix.asClass(AnomalyAnalyzer).singleton(),
            dockerEngineClient: awilix.asClass(DockerEngineClient).singleton(),
            dockerRegistryClient: awilix.asClass(DockerRegistryClient).singleton(),
            realizationTranslator: awilix.asClass(RealizationTranslator).singleton(),
            containerTranslator: awilix.asClass(ContainerTranslator).singleton(),
            containerRepository: awilix.asClass(ContainerRepository).singleton(),
            eventRepository: awilix.asClass(EventRepository).singleton(),
            environmentService: awilix.asClass(EnvironmentService).singleton(),
            environmentInterface: awilix.asClass(EnvironmentInterface).singleton(),
            environmentMonitor: awilix.asClass(EnvironmentMonitor).singleton(),
            restRoutesBuilder: awilix.asClass(RestRoutesBuilder).singleton(),
            anomalyService: awilix.asClass(AnomalyService).singleton(),
            anomalyInterface: awilix.asClass(AnomalyInterface).singleton(),
            containerService: awilix.asClass(ContainerService).singleton(),
            containerMessageTranslator: awilix.asClass(ContainerMessageTranslator).singleton(),
            clusterTranslator: awilix.asClass(ClusterTranslator).singleton(),
            clusterInterface: awilix.asClass(ClusterInterface).singleton(),
            userRepository: awilix.asClass(UserRepository).singleton(),
            identityInterface: awilix.asClass(IdentityInterface).singleton(),
            environmentRepository: awilix.asClass(EnvironmentRepository).singleton()
        });
        container.registerValue({
            configuration: config,
            cache: nanoCache
        });

        return container;
    }
};
