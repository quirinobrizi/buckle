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

const EnvironmentRepository = require('../../../src/domain/repository/EnvironmentRepository');

describe('EnvironmentRepository', function () {

    var testObj, containerRepository, container1, container2, dockerEngineClient;
    before(function () {
        var dec = {
            getSwarm: function() {  }
        };
        var repo = {
            getName: function() { },
            getAll: function() {}
        };
        var c = {
            getContainerId: function() {},
            getName: function() {  },
            isDeployedOnNode: function(node) {}
        };
        container1 = td.object(c);
        container2 = td.object(c);
        td.when(container1.getContainerId()).thenReturn("a");
        td.when(container2.getContainerId()).thenReturn("b");

        dockerEngineClient = td.object(dec);
        containerRepository = td.object(repo);
        testObj = new EnvironmentRepository(dockerEngineClient, containerRepository);
    })

    it('retrieves containers ', async function () {
        let containers = [container1, container2];

        td.when(dockerEngineClient.getSwarm()).thenReturn({
            Name: "name",
            ServerVersion: "1.2.8",
        });
        td.when(containerRepository.getAll()).thenReturn(containers);

        // act
        let actual = await testObj.get();
        // assert
        assert.equal("name", actual.getName());
        assert.equal("1.2.8", actual.getVersion());
        assert.equal(2, actual.getContainers().size);
        assert.deepEqual(containerRepository, actual.containerRepository);
    });

    afterEach(function () {
        td.reset()
    });
});
