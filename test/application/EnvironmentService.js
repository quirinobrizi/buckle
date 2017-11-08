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

const EnvironmentService = require('../../src/application/EnvironmentService');

describe('EnvironmentService', function() {

    var testObj,
        environmentRepository,
        anomalyService,
        eventEmitter,
        environment,
        realization;

    before(function() {
        anomalyService = td.object({});
        environmentRepository = td.object({
            get: function() {}
        });
        environment = td.object({
            inspectRealizationsForAnomalies: function(realization, anomalyService) {}
        });
        eventEmitter = td.object({
            emit: function(evt, obj) {}
        });
        realization = td.object({
            getContainerId: function() {}
        });

        testObj = new EnvironmentService(eventEmitter, anomalyService, environmentRepository);
    });

    it('evaluate realization', async function() {
        var containers = [];
        td.when(environmentRepository.get()).thenReturn(environment);
        td.when(environment.inspectRealizationsForAnomalies(realization, anomalyService)).thenReturn(containers);
        // act
        await testObj.evaluateRealization(realization);
        // verify
        td.verify(eventEmitter.emit('containers.updated', containers));
    })
});
