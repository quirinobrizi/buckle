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

const assert = require('assert');

const NodeTranslator = require('../../../../src/domain/repository/translator/NodeTranslator');

describe('Node Translator', function() {
    it('translate node information into node model object', function() {
        let node = {
            "ID": "JG4P:LENV:4B3P:AWK2:R6RJ:7BU3:I2D3:S4QN:SGOH:3V5K:OKNG:ZUJ2|10.0.1.83:2376",
            "IP": "10.0.1.83",
            "Addr": "10.0.1.83:2376",
            "Name": "dev-swarm-node-01",
            "Cpus": 2,
            "Memory": 4142297088,
            "Labels": {
                "kernelversion": "4.4.0-1020-aws",
                "operatingsystem": "Ubuntu 16.04.2 LTS",
                "ostype": "linux",
                "provider": "amazonec2",
                "storagedriver": "aufs"
            }
        };
        let properties = new Map();
        for(let key in node.Labels) {
            properties.set(key, node.Labels[key]);
        }

        let testObj = new NodeTranslator();
        // act
        let actual = testObj.translate(node);
        // assert
        assert.equal(node.ID, actual.getId());
        assert.equal(node.IP, actual.getIp());
        assert.equal(node.Addr, actual.getDaemonAddress());
        assert.equal(node.Name, actual.getName());
        assert.equal(node.Cpus, actual.getNumberOfCpu());
        assert.equal(node.Memory, actual.getMemory());
        assert.deepEqual(properties, actual.getProperties());
    });
});
