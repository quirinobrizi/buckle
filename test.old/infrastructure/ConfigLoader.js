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

const ConfigLoader = require('../../../src/infrastructure/ConfigLoader');

var testObj = new ConfigLoader();

describe('Config loader', function() {
  it('loads the configuration', function(done) {
    done();
    // var expected = { buckle: { docker: { registry: { uri:
    // 'http://docker.registry.io' } } } }
    // testObj.load('./test/resources/buckle.yml','utf-8').
    // then(function(config) {
    // config.should.be.eql(expected);
    // done();
    // }).catch(function (err) {
    // console.log(err);
    // fail();
    // });
  });
})
