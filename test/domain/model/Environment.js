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

const Environment = require('../../../src/domain/model/Environment');

describe("Environment", function () {

    var testObj, container1, container2, containerRepository;
    before(function () {
        var c = {
            getContainerId: function () {},
            getName: function () {},
            isDeployedOnNode: function (node) {},
            inspect: function (anomalyService, containerRepository) {},
            getNodeName: function () {},
            updateLimts: function (containerRepository) {},
            getNode: function () {},
            addRealization: function (r) {},
            getCpuLimit: function () {},
            hasAnomalies: function() {}
        };
        containerRepository = td.object({
            save: function (c) {}
        });
        container1 = td.object(c);
        container2 = td.object(c);
        td.when(container1.getContainerId()).thenReturn("1");
        td.when(container2.getContainerId()).thenReturn("2");

        let containers = [container1, container2];
        testObj = new Environment("name", "1");
        testObj.setContainers(containers).setContainerRepository(containerRepository);
    });

    it("provide containers on node", function () {

        td.when(container1.isDeployedOnNode("a")).thenReturn(true);
        td.when(container1.getName()).thenReturn("container1");

        td.when(container2.isDeployedOnNode("a")).thenReturn(false);
        td.when(container2.getName()).thenReturn("container2");

        // act
        let actual = testObj.getContainersOnNode("a");

        assert.equal(1, actual.length);
        assert.equal("container1", actual[0].getName());
    });

    it("allows retrieve a container", function () {

        td.when(container1.isDeployedOnNode("a")).thenReturn(true);
        td.when(container1.getName()).thenReturn("container1");

        td.when(container2.isDeployedOnNode("a")).thenReturn(false);
        td.when(container2.getName()).thenReturn("container2");

        // act
        let actual = testObj.getContainer("2");

        assert.equal("container2", actual.getName());
    });

    it("return null if container does not exists", function () {

        td.when(container1.isDeployedOnNode("a")).thenReturn(true);
        td.when(container1.getName()).thenReturn("container1");

        td.when(container2.isDeployedOnNode("a")).thenReturn(false);
        td.when(container2.getName()).thenReturn("container2");

        // act
        let actual = testObj.getContainer("5");

        assert.equal(undefined, actual);
    });

    it('inspects realizations for anomalies, no anomalies detected', function () {
        let realization = td.object({
            getContainerId: function () {}
        });
        let anomalyService = td.object({});
        let containerRepository = td.object({});

        td.when(realization.getContainerId()).thenReturn("1");
        td.when(container1.inspect(anomalyService)).thenReturn(false);
        // act
        var actual = testObj.inspectRealizationsForAnomalies(realization, anomalyService);
        // assert
        assert.deepEqual([], actual);
        // verify
        td.verify(container1.addRealization(realization));
    });

    it('inspects realizations for anomalies, anomalies detected', async function () {
        try {
            let realization = td.object({
                getContainerId: function () {},
                setAllocatedCpu: function () {}
            });
            let anomalyService = td.object({});
            let node = td.object({
                distributeResources: function (containerRepository, containers) {}
            });

            td.when(container1.getNode()).thenReturn(node);
            td.when(realization.getContainerId()).thenReturn("1");
            td.when(container1.getNodeName()).thenReturn("a");
            td.when(container1.isDeployedOnNode("a")).thenReturn(true);
            td.when(container1.inspect(anomalyService)).thenReturn(true);

            let containerRequirements = new Map();
            containerRequirements.set(container1, {
                cpu: 50000,
                memory: 9876754312
            })
            td.when(node.distributeResources([container1])).thenReturn(containerRequirements);
            // act
            var actual = await testObj.inspectRealizationsForAnomalies(realization, anomalyService);
            // assert
            assert.equal(1, actual.length);
            assert.deepEqual([container1], actual);
            // verify
            td.verify(container1.addRealization(realization));
        } catch (e) {
            console.log(e.stack);
        }
    });
});
