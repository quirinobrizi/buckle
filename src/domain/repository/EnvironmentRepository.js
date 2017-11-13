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

const Node = require('../model/Node');
const Environment = require('../model/Environment');
const NodeTranslator = require('./translator/NodeTranslator');

const logger = require('../../infrastructure/Logger');

module.exports = class EnvironmentRepository {

    constructor(dockerEngineClient, containerRepository) {
        this.dockerEngineClient = dockerEngineClient;
        this.containerRepository = containerRepository;
        this.nodeTranslator = new NodeTranslator();

        this.swarmKitEnabled = true;
    }

    /**
     * Retrieve all containers deployed on this environemnt, this method is used in real-time operations.
     * @return {Environment} the environment
     */
    async get() {
        logger.debug("retrieve environment");
        let answer = await this.queryInfo();
        answer.setContainerRepository(this.containerRepository);
        try {
            if (this.swarmKitEnabled) {
                logger.info("Try build environment starting from tasks, this is when SwarmKit (Swarm mode) is enabled.")
                let tasks = await this.dockerEngineClient.listTasks();
                for (var i = 0; i < tasks.length; i++) {
                    let task = tasks[i];
                    let nodeId = task.NodeID;
                    let container = await this.containerRepository.getContainer(task.Status.ContainerStatus.ContainerID);
                    if (container.getName().includes('swarm-agent')) {
                        continue;
                    }
                    await this._addContainer(answer, container, nodeId);
                }
            } else {
                answer = this._loadFromContainers(answer);
            }
        } catch (e) {
            console.log("caught exception ", e);
            this.swarmKitEnabled = false;
            answer = await this._loadFromContainers(answer);
        }
        return answer;
    }

    /**
     * Retrieve detailed environment information
     * @method queryInfo
     * @return {Environment} the environment information
     */
    async queryInfo() {
        let details = await this.dockerEngineClient.queryInfo();
        return new Environment(details.Name || details.Swarm.Cluster.Spec.Name)
            .setNumberOfContainers(details.Containers)
            .setNumberOfRunningContainers(details.ContainersRunning)
            .setNumberOfPausedContainers(details.ContainersPaused)
            .setNumberOfStoppedContainers(details.ContainersStopped)
            .setNumberOfNodes(details.Swarm.Nodes)
            .setNumberOfManagers(details.Swarm.Managers)
            .setServerVersion(details.ServerVersion)
            .setArchitecture(details.Architecture)
            .setOsType(details.OSType)
            .setOperatingSystem(details.OperatingSystem)
            .setKernelVersion(details.KernelVersion);
    }

    async _loadFromContainers(answer) {
        logger.debug("SwarmKit not enabled build nodes from containers list");
        let containers = await this.containerRepository.getAll();
        for (var i = 0; i < containers.length; i++) {
            let container = await this.containerRepository.get(containers[i].getContainerId());
            logger.debug("adding container %s", container.getName());
            if (container.getName().includes('swarm-agent')) {
                continue;
            }
            let nodeId = container.getNode();
            await this._addContainer(answer, container, nodeId);
        }
        return answer;
    }

    async _addContainer(environment, container, nodeId) {
        if (environment.hasNode(nodeId)) {
            environment.addContainerToNode(nodeId, container);
        } else {
            logger.debug("node %s not found inspecting it", nodeId);
            let node;
            if (this.swarmKitEnabled) {
                node = this.nodeTranslator.translate(await this.dockerEngineClient.inspectNode(nodeId));
            } else {
                logger.debug("unable to inspect node create a default one")
                node = Node.default(nodeId);
            }
            node.addContainer(container);
            environment.addNode(node);
        }
    }
};
