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

const testObj = require('../../../../src/infrastructure/helper/ContainerHelper');

describe('Container Helper', function() {
  it('extract cluster name', function(done) {
    var cluster = testObj.extractClusterName("/ngjhnwixndg3y2njntzmn2fhmtk5m2yx_cluster_1")
    "cluster".should.be.equal(cluster);
    done();
  });

  it('extract cluster name 2', function(done) {
    var cluster = testObj.extractClusterName("ngjhnwixndg3y2njntzmn2fhmtk5m2yx_cluster_1");
    "cluster".should.be.equal(cluster);
    done();
  });

  it('extract container node', function(done) {
    var node = testObj.extractContainerNode("/ngjhnwixndg3y2njntzmn2fhmtk5m2yx_cluster_1")
    "unknown".should.be.equal(node);
    done();
  });

  it('extract container node 2', function(done) {
    var node = testObj.extractContainerNode("/node-01/ngjhnwixndg3y2njntzmn2fhmtk5m2yx_cluster_1")
    "node-01".should.be.equal(node);
    done();
  });
})
