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

const Environment = require('../model/Environment');

module.exports = class EnvironmentRepository {

    constructor(dockerEngineClient, containerRepository) {
        this.dockerEngineClient = dockerEngineClient;
        this.containerRepository = containerRepository;
        this.nodeTranslator = new NodeTranslator();
    }

    /**
     * Retrieve all containers deployed on this environemnt, this method is used in real-time operations.
     * @return {Environment} the environment
     */
    async get() {
        let swarm = await this.dockerEngineClient.getSwarm();
        let answer = new Environment(swarm.Name || swarm.Spec.Name);
        try {
            // Build environment starting from tasks, this is when SwarmKit (Swarm mode)
            // is enabled.
            let tasks = await this.dockerEngineClient.listTasks();
            for (var i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                let nodeId = task.NodeID;
                let container = await this.containerRepository.getContainer(task.Status.ContainerStatus.ContainerID);
                if(answer.hasNode(nodeId)) {
                    answer.addContainerToNode(nodeId, container);
                } else {
                    let node = this.nodeTranslator(await this.dockerEngineClient.inspectNode(task.NodeID);
                    node.addContainer(container);
                    answer.addNode(node);
                }
            }
        } catch (e) {
            // SwarmKit not enabled build from containers list
            let containers = await this.containerRepository.getAll();
            for (var i = 0; i < containers.length; i++) {
                var container = containers[i];
                
            }
        }

        // let nodes = await self.dockerEngineClient.listNodes();

        return new Environment(swarm.Name || swarm.Spec.Name)
            .setContainers(containers)
            .setContainerRepository(this.containerRepository);
    }

    /**
     * Retrieve detailed environment information
     * @method queryInfo
     * @return {Environment} the environment information
     */
    async queryInfo() {
        let details = await this.dockerEngineClient.queryInfo();
        return new Environment(details.Swarm.Cluster.Spec.Name)
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
};
