#!/usr/bin/env node

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

const fs = require('fs');
const format = require('util').format;

const Node = require('../domain/Node');
const Swarm = require('../domain/Swarm');
const Manager = require('../domain/Manager');
const toolsPreconditionChecker = require('../precondition/ToolsPreconditionChecker');


module.exports = class CreateSwarmCommand {

    constructor(driverFactory) {
        this.driverFactory = driverFactory;
    }

    /**
     * Create a new swarm environment based on the configuration provided,
     * returns the swarm structure that has been defined.
     * @method execute
     * @param  {object} configuration the swarm configuration
     * @return {object}               the swarm structure
     */
    execute(configuration) {

        if (toolsPreconditionChecker.check()) {
            console.log("creating swarm");
            var conf = JSON.parse(fs.readFileSync(configuration, 'utf8'));
            var driver = this.driverFactory.get(conf.driver);

            let managers = [];
            let nodes = [];

            for (var i = 0; i < conf.topology.master.number; i++) {
                let name = driver.create('master', conf.topology.master.specs, conf.environment);
                console.log("machine [%s] created", name);
                let ip = driver.ipAddress(name);
                if(i==0) {
                    driver.initializeSwarm(name, ip);
                } else {
                    let primary = managers[0];
                    driver.joinSwarm(name, ip, primary.getManagerToken(), primary.getIpAddress(), primary.getPort());
                }
                let tokens = new Map();
                if(i==0) {
                    tokens.set('manager', driver.token(name, "manager"));
                    tokens.set('node', driver.token(name, "worker"));
                }
                managers.push(new Manager(name, i == 0, ip, 2377, tokens));
            }

            for (var i = 0; i < conf.topology.node.number; i++) {
                let name = driver.create('node', conf.topology.node.specs, conf.environment);
                console.log("machine [%s] created", name);
                let ip = driver.ipAddress(name);
                let primary = managers[0];
                driver.joinSwarm(name, ip, primary.getWorkerToken(), primary.getIpAddress(), primary.getPort());

                nodes.push(new Node(name, ip));
            }
            return new Swarm("", managers, nodes);
        } else {
            return false;
        }
    }

};
