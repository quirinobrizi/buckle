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

const yaml = require('js-yaml');
const fs   = require('fs');
const util = require('util');

const ComposeAdaptor = require('../../../src/adaptor/compose-adaptor');
const testObj = new ComposeAdaptor();

describe('Compose Adaptor', function () {
  it('parses compose version 1', function (done) {
    var compose  = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v1.yml', 'utf8'));
    var actual = testObj.adapt(compose);
    actual.should.not.be.null;
    console.log(util.inspect(actual, false, null));
    done();
  });

  it('parses compose version 2', function (done) {
    done();
  });

  it('parses compose version 3', function (done) {
    done();
  });
})
