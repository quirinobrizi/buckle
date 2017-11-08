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

const Statistics = require('../../../../src/infrastructure/ai/system-observer');
const testObj = new Statistics({});

describe('Statistics', function() {
  it('removes orphans', function(done) {
    testObj.clusters = {
      'c1' : {
        containers : {
          '01' : {
            statistics : []
          },
          '02' : {
            statistics : []
          }
        }
      },
      'c2' : {
        containers : {
          '012' : {
            statistics : []
          }
        }
      }
    };
    var expected = {
      'c1' : {
        containers : {
          '01' : {
            statistics : []
          }
        }
      },
      'c2' : {
        containers : {
          '012' : {
            statistics : []
          }
        }
      }
    }
    testObj.removeOrphans([ {
      Id : '01'
    }, {
      Id : '012'
    } ]);
    expected.should.be.eql(testObj.clusters);
    done();
  });

})
