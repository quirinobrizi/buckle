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

const assert = require('assert');

const Parser = require('../src/Parser');
const VersionMismatchException = require('../src/exception/VersionMismatchException');

describe('Parser', function () {

    var testObj;
    before(function () {
        testObj = new Parser([{
                version: "2.0",
                services: {}
            },
            {
                version: "2.0",
                services: {}
            }
        ], {});
    });

    it("verifies versions are matching", function () {
        // act
        testObj.parse();
    });

    it("verifies versions are not matching", function () {
        let parser = new Parser([{
                version: "2.0"
            },
            {
                version: "1.0"
            }
        ], {});
        // act
        try {
            parser.parse();
            assert.ok(false);
        } catch (e) {
            if (e instanceof VersionMismatchException) {
                assert.ok(true);
            } else {
                assert.ok(false);
            }
        }
    });
});
