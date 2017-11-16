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

const extend = require('extend');

module.exports = class Merger {
    constructor() {

    }

    /**
     * Merge the configuration objects into one, assumes that the element at
     * order 0 is teh main
     * @param  {Array.<Object>} configurations The configurations
     * @return {Object}                The merged configurations
     */
    merge(configurations) {
        let answer = {};
        let main = configurations[0];
        extend(true, answer, main);
        for (var i = 1; i < configurations.length; i++) {
            let configuration = configurations[i];
            extend(true, answer, configuration);
        }
        return answer;
    }
};
