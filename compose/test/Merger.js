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

'use strict';

const yaml = require('js-yaml');
const fs   = require('fs');
const assert = require('assert');

const Merger = require('../src/Merger');

describe("Merger", function() {

    it("merge the configurations", function() {
        let testObj = new Merger();
        let configuration = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v1-environment-variables.yml', 'utf8'));
        let configuration2 = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v1-environment-variables-override.yml', 'utf8'));

        // act
        let actual = testObj.merge([configuration, configuration2]);
        // assert
        assert.ok(actual.dbpostgres.environment);
        assert.ok(actual.dbpostgres.image);
        assert.ok(actual.dbpostgres.ports);
        assert.ok(actual.dbpostgres.volumes_from);

        assert.ok(actual['express-app-container'].environment);
        assert.ok(actual['express-app-container'].image);
        assert.ok(actual['express-app-container'].ports);
        assert.ok(actual['express-app-container'].volumes);
        assert.ok(actual['express-app-container'].links);
    });
});
