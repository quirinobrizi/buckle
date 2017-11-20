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
const util = require('util');
const yaml = require('js-yaml');
const assert = require('assert');

const ComposeAdaptorV2 = require('../../src/adaptor/ComposeAdaptorV2');

describe("ComposeAdaptorV2", function() {

    it("adapt configuration received", function() {
        let testObj = new ComposeAdaptorV2();
        let configuration = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v2.yml', 'utf8'));
        // act
        let actual = testObj.adapt(configuration);
        // assert
        console.log(util.inspect(actual, {
            colors: true,
            depth: 10
        }));
        let expected = [];
        assert.deepEqual(actual.containers, expected);
    });
});
