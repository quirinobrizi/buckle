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

const testObj = require('../../../src/infrastructure/helper/ContainerHelper');

describe("ContainerHelper", () => {
    it("define deployment dependencies order", () => {
        let configuration = {
            containers: {},
            dependencies: [
                {
                    name: 'c1',
                    order: ['c2']
                },
                {
                    name: 'c2',
                    order: undefined
                },
                {
                    name: 'c3',
                    order: ['c1']
                }
            ]
        };
        let expected = ['c2', 'c1', 'c3'];
        // act
        let actual = testObj.defineDeploymentOrder(configuration);
        console.log(actual);
        // assert
        assert.deepEqual(expected, actual);
    });

    it("define deployment dependencies order multiple dependencies", () => {
        let configuration = {
            containers: {},
            dependencies: [
                {
                    name: 'c1',
                    order: ['c2']
                },
                {
                    name: 'c2',
                    order: undefined
                },
                {
                    name: 'c3',
                    order: ['c1', 'c2']
                },
                {
                    name: 'c4',
                    order: ['c3', 'c1']
                }
            ]
        };
        let expected = ['c2', 'c1', 'c3', 'c4'];
        // act
        let actual = testObj.defineDeploymentOrder(configuration);
        console.log(actual);
        // assert
        assert.deepEqual(expected, actual);
    });

    it("define deployment dependencies order, no dependencies", () => {
        let configuration = {
            containers: {
                'c1': {},
                'c2': {},
                'c3': {}
            },
            dependencies: [
            ]
        };
        let expected = ['c1', 'c2', 'c3'];
        // act
        let actual = testObj.defineDeploymentOrder(configuration);
        console.log(actual);
        // assert
        assert.deepEqual(expected, actual);
    });
})
