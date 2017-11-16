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
const fs = require('fs');
const yaml = require('js-yaml');
const assert = require('assert');

const Interpolator = require('../src/Interpolator');
const InterpolationException = require('../src/exception/InterpolationException');

describe("Interpolator", function () {

    it("interpolate environment variables for docker compose only one configuration", function () {
        let testObj = new Interpolator();
        let configuration = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v1-environment-variables.yml', 'utf8'));
        let environment = new Map();
        environment.set("POSTGRES_VERSION", "9.3.1");
        environment.set("POSTGRES_PORT", "5432:5432");
        // act
        let actual = testObj.interpolate([configuration], environment);
        // assert
        assert.equal(actual.length, 1);
        assert.equal(actual[0].dbpostgres.image, "postgres:9.3.1");
        assert.equal(actual[0].dbpostgres.ports[0], "5432:5432");
    });

    it("interpolate environment variables for docker compose more than one configuration", function () {
        let testObj = new Interpolator();
        let configuration = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v1-environment-variables.yml', 'utf8'));
        let configuration2 = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v1-environment-variables-override.yml', 'utf8'));

        let environment = new Map();
        environment.set("POSTGRES_VERSION", "9.3.1");
        environment.set("POSTGRES_PORT", "5432:5432");
        environment.set("DB_HOST", "localhost")
        // act
        let actual = testObj.interpolate([configuration, configuration2], environment);
        // assert
        assert.equal(actual.length, 2);
        assert.equal(actual[0].dbpostgres.image, "postgres:9.3.1");
        assert.equal(actual[0].dbpostgres.ports[0], "5432:5432");
        assert.equal(actual[1].dbpostgres.environment[0]['VERSION'], "9.3.1");
        assert.equal(actual[1]['express-app-container'].environment[0]["DB_HOST"], "localhost");
    });

    it("throw exception if variable is not defined", function () {
        let testObj = new Interpolator();
        let configuration = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v1-environment-variables.yml', 'utf8'));
        let environment = new Map();
        environment.set("POSTGRES_VERSION", "9.3.1");
        // act
        try {
            let actual = testObj.interpolate([configuration], environment);
            assert.ok(false);
        } catch (e) {
            assert.ok(e instanceof InterpolationException);
        }
    });
});
