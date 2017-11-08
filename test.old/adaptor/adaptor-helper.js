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

const testObj = require('../../../src/adaptor/adaptor-helper');

describe('Compose Adaptor', function() {
  it('parses ports defined as a container mapping only with no protocol', function(done) {

    var expected = {
      "3000/tcp" : []
    };
    var ports = [];
    ports.push("3000");
    var actual = testObj.parsePortBindings(ports);
    actual.should.be.eql(expected);
    done();
  });

  it('parses ports defined as a container range mapping only with no protocol', function(done) {

    var expected = {
      "3000/tcp" : [],
      "3001/tcp" : [],
      "3002/tcp" : []
    };
    var ports = [];
    ports.push("3000-3002");
    var actual = testObj.parsePortBindings(ports);
    actual.should.be.eql(expected);
    done();
  });

  it('parses ports defined as a host:container mapping only with no protocol', function(done) {

    var expected = {
      "3000/tcp" : [ {
        "HostPort" : "3000"
      } ]
    };
    var ports = [];
    ports.push("3000:3000");
    var actual = testObj.parsePortBindings(ports);
    actual.should.be.eql(expected);
    done();
  });

  it('parses ports defined as a host:container range mapping only with no protocol', function(done) {

    var expected = {
      "3000/tcp" : [ {
        "HostPort" : "3000"
      } ],
      "3001/tcp" : [ {
        "HostPort" : "3001"
      } ],
      "3002/tcp" : [ {
        "HostPort" : "3002"
      } ]
    };
    var ports = [];
    ports.push("3000-3002:3000-3002");
    var actual = testObj.parsePortBindings(ports);
    actual.should.be.eql(expected);
    done();
  });

  it('parses ulimits as a soft/hard', function(done) {

    var expected = [ {
      name : 'nofile',
      hard : 1024,
      soft : 1024
    } ];
    var ulimits = {
      nofile : {
        hard : 1024,
        soft : 1024
      }
    };
    var actual = testObj.parseUlimits(ulimits);
    actual.should.be.eql(expected);
    done();
  });

  it('parses ulimits as a single value', function(done) {

    var expected = [ {
      name : 'nofile',
      hard : 1024,
      soft : 1024
    } ];
    var ulimits = {
      nofile : 1024
    };
    var actual = testObj.parseUlimits(ulimits);
    actual.should.be.eql(expected);
    done();
  });
})
