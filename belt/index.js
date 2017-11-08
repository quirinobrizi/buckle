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

const belt = require('yargs');

const DriverFactory = require('./src/command/driver/DriverFactory');
const CreateSwarmCommand = require('./src/command/CreateSwarmCommand');

belt
    .usage('$0 <cmd> [args]')
    .command('create [configuration]', 'Create a swarm environment', (yargs) => {
        yargs
            .option('c', {
                alias: 'configuration',
                type: 'string',
                default: './config/buckle-belt.json',
                describe: 'the absolute path of the configuration file that describes the swarm to create'
            })
    }, function(argv) {
        try {
            let swarm = new CreateSwarmCommand(new DriverFactory())
                .execute(argv.configuration);

            console.log("Created swarm %s", JSON.stringify(swarm));
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    })
    .help()
    .argv
