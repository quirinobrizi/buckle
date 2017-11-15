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

const util = require('util');

module.exports = class Parsers {

    /**
     * Create a new compose file parser
     * @param  {Array.<Object>} configurations the configuration files, the
     *         order of the files define the override order specifically the configuration
     *         at position 0 will be condidered the master one, the one at position n-1 the
     *         latest override, this means that the override will start from position n-1 to 0.
     * @param  {Map} environment    a map containing environment variables to be sobstituted
     * @return {Parser}             A new parser instance
     */
    constructor(configurations, environment) {
        this.configurations = configurations;
        this.environment = environment;
    }

    /**
     * Parse the compose configuration
     * @return {Object} The containers configuration as per requested compose version
     */
    parse() {
        this._validateVersion()
    }

    _validateVersion() {
        let master = this.configurations[0];
        for (let i = 1; i < this.configurations.length; i++) {
            let configuration = this.configurations[i];
            if(master.version !== configuration.version) {
                let VersionMismatchException = require('./exception/VersionMismatchException');
                throw new VersionMismatchException(
                    util.format("Version mismatch: master configuration specifies version %s but extension uses version %s",
                                master.version, configuration.version));
            }
        }
    }
};
