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

const EventReceiver = require('../../../src/infrastructure/ai/EventReceiver');

describe(
        'EventReceiver',
        function() {
            it(
                    'receive events and forward as a combination of type and status',
                    function(done) {
                        var emitter = {
                            emit : function(evt, payload) {
                                evt.should.be.equal('container.create');
                                payload.getId().should.be
                                        .equal('ede54ee1afda366ab42f824e8a5ffd195155d853ceaec74a927f249ea270c743');
                                payload.getType().should.be.equal('container');
                                payload.getAction().should.be.equal('create');
                                payload.getTime().should.be.equal(1461943101000);
                                done()
                            }
                        }
                        var testObj = new EventReceiver(emitter);
                        testObj
                                .write("{\"id\": \"ede54ee1afda366ab42f824e8a5ffd195155d853ceaec74a927f249ea270c743\", \"Type\": \"container\", \"Action\":\"create\", \"time\":1461943101}");
                    });
        })