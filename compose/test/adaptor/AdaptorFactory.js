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

const AdaptorNotFoundException = require('../../src/exception/AdaptorNotFoundException');
const AdaptorFactory = require('../../src/adaptor/AdaptorFactory');

const assert = require('assert');

describe("AdaptorFactory", function() {

    let testObj = new AdaptorFactory();

    it("return a valid adaptor", function() {
        // act
        let actual = testObj.get('1');
        // assert
        assert.ok(actual);
    });

    it("throw exceptio if adaptor is not found", function() {
        try {
            testObj.get('abcd');
            assert.ok(false);
        } catch (e) {
            assert.ok(e instanceof AdaptorNotFoundException);
        }
    });
});
