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

const util = require('util');
const fs   = require('fs');
const yaml = require('js-yaml');
const assert = require('assert');

const Interpolator = require('../src/Interpolator');

describe("Interpolator", function() {

    it("interpolate environment variables for docker compose v1", function() {
        let testObj = new Interpolator();
        let configuration  = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v1-environment-variables.yml', 'utf8'));
        let environment = new Map();
        environment.set("POSTGRES_VERSION", "9.3.1");
        environment.set("POSTGRES_PORT", "5432:5432");
        // act
        let actual = testObj.interpolate([configuration], environment);
        // assert
        assert.equals(actual.length, 1);
        assert.equals(actual[0].dbpostgres.image, "postgres:9.3.1");
    });
});
