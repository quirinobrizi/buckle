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

const td = require('testdouble');
const assert = require('assert');

const Node = require('../../../src/domain/model/Node');

describe('Node', function() {
    var testObj, containerRepository, container1, container2, container3, container4;
    before(function() {
        containerRepository = td.object({});
        let container = {
            getName: function() {},
            getContainerId: function() {},
            update: async function(containerRepository) {},
            needToBeUpdated: function() {},
            calculateRequiredCpuQuota: function() {},
            calculateRequiredMemory: function() {}
        };
        container1 = td.object(container);
        container2 = td.object(container);
        container3 = td.object(container);
        container4 = td.object(container);

        td.when(container1.getName()).thenReturn("container1");
        td.when(container2.getName()).thenReturn("container2");
        td.when(container3.getName()).thenReturn("container3");
        td.when(container4.getName()).thenReturn("container4");

        td.when(container1.getContainerId()).thenReturn("container1");
        td.when(container2.getContainerId()).thenReturn("container2");
        td.when(container3.getContainerId()).thenReturn("container3");
        td.when(container4.getContainerId()).thenReturn("container4");

        testObj = new Node('1', 'node-1')
            .setNumberOfCpu(2).setMemory(4142297088);
    });

    it('distribute resources to containers, no resource excess', async function() {
        var containers = [container1, container2, container3, container4];

        td.when(container1.calculateRequiredCpuQuota()).thenReturn(30000);
        td.when(container2.calculateRequiredCpuQuota()).thenReturn(15000);
        td.when(container3.calculateRequiredCpuQuota()).thenReturn(22000);
        td.when(container4.calculateRequiredCpuQuota()).thenReturn(30000);

        td.when(container1.calculateRequiredMemory()).thenReturn(1035574272);
        td.when(container2.calculateRequiredMemory()).thenReturn(635574272);
        td.when(container3.calculateRequiredMemory()).thenReturn(1035574272);
        td.when(container4.calculateRequiredMemory()).thenReturn(95574272);
        // act
        var actual = await testObj.distributeResources(containers);
        // assert
        assert.equal(actual.size, 4);
        for (let[container, value] of actual) {
            assert.equal(container.calculateRequiredCpuQuota(), value.cpu);
            assert.equal(container.calculateRequiredMemory(), value.memory);
        }
    });

    it('distribute resources to containers, resource excess', async function() {
        var containers = [container1, container2, container3, container4];

        td.when(container1.calculateRequiredCpuQuota()).thenReturn(60000);
        td.when(container2.calculateRequiredCpuQuota()).thenReturn(15000);
        td.when(container3.calculateRequiredCpuQuota()).thenReturn(22000);
        td.when(container4.calculateRequiredCpuQuota()).thenReturn(30000);

        td.when(container1.calculateRequiredMemory()).thenReturn(1035574272);
        td.when(container2.calculateRequiredMemory()).thenReturn(635574272);
        td.when(container3.calculateRequiredMemory()).thenReturn(1035574272);
        td.when(container4.calculateRequiredMemory()).thenReturn(95574272);
        // act
        var actual = await testObj.distributeResources(containers);
        // assert
        assert.equal(actual.size, 4);
        for (let[container, value] of actual) {
            assert.equal(container.calculateRequiredCpuQuota(), value.cpu);
            assert.equal(container.calculateRequiredMemory(), value.memory);
        }
    });

    it('distribute resources to containers, resource excess over max quotas', async function() {
        var containers = [container1, container2, container3, container4];

        td.when(container1.calculateRequiredCpuQuota()).thenReturn(80000);
        td.when(container2.calculateRequiredCpuQuota()).thenReturn(15000);
        td.when(container3.calculateRequiredCpuQuota()).thenReturn(65000);
        td.when(container4.calculateRequiredCpuQuota()).thenReturn(78000);

        td.when(container1.calculateRequiredMemory()).thenReturn(1035574272);
        td.when(container2.calculateRequiredMemory()).thenReturn(635574272);
        td.when(container3.calculateRequiredMemory()).thenReturn(1035574272);
        td.when(container4.calculateRequiredMemory()).thenReturn(95574272);
        // act
        var actual = await testObj.distributeResources(containers);
        // assert
        assert.equal(actual.size, 4);

        assert.equal(80000, actual.get(container1).cpu);
        assert.equal(1035574272, actual.get(container1).memory);

        assert.equal(15000, actual.get(container2).cpu);
        assert.equal(635574272, actual.get(container2).memory);

        assert.equal(55000, actual.get(container3).cpu);
        assert.equal(1035574272, actual.get(container3).memory);

        assert.equal(50000, actual.get(container4).cpu);
        assert.equal(95574272, actual.get(container4).memory);

    });
});
