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

const AdaptorNotFoundException = require('../exception/AdaptorNotFoundException');
const ComposeAdaptorV1 = require('./ComposeAdaptorV1');
const ComposeAdaptorV2 = require('./ComposeAdaptorV2');

module.exports = class AdaptorFactory {
    constructor() {
        this.adaptors = new Map();
        this.adaptors.set("1", new ComposeAdaptorV1());

        this.adaptors.set("2", new ComposeAdaptorV2());
        this.adaptors.set("2.0", new ComposeAdaptorV2());
    }

    /**
     * Allow to retrieve the compose adaptor for the requested compose version
     * @param  {string} version the compose version
     * @return {Adaptor]}         the adaptor
     */
    get(version) {
        if(this.adaptors.has(version)) {
            return this.adaptors.get(version);
        }
        throw new AdaptorNotFoundException(version);
    }
};
