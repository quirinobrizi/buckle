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

module.exports = class Interpolator {
    constructor() {

    }

    /**
     * Interpolate the provided configurations replacing all environement
     * varaibles with the defined value, if a match is not found for the
     * environment variable an InterpolationException is thrown.
     * Environment variables are expected to be defined as ${VAR} or $VAR
     *
     * @param  {Array.<Object>} configurations The configuration definition
     * @param  {Map} environment    the environment variables
     * @return {Array.<Object>}     the intepolated configuration
     */
    interpolate(configurations, environment) {
        var answer = new Array();
        for (let i = 0; i < configurations.length; i++) {
            let configuration = configurations[i];
            this._doInterpolate(configuration, environment);
        }
        return answer;
    }

    /**
     * Interpolate the provide configuration replacing all environment variables
     * @param  {Object} configuration the configuration
     * @param  {Map} environment   The environment variables
     * @return {Object}            The interpolated configurarion
     */
    _doInterpolate(configuration, environment) {
        for (let key in configuration) {
            if (configuration.hasOwnProperty(key)) {
                let value = configuration[key];
                let type = typeof value;
                let result;
                if (type === 'object') {
                    result = this._doInterpolate(value, environment);
                } else {
                    let match = /^\$\{{0,1}([A-Z]+)\}{0,1}/g.exec(value);
                    if (match) {
                        let ev = match[1];
                        if (value === util.format("$%s", ev)) {
                            result = environment.get(ev);
                        } else if (value === util.format("${%s}", ev)) {
                            result = environment.get(ev);
                        } else if (value.includes(util.format("$%s", ev))) {

                        } else if (value.includes(util.format("${%s}", ev))) {

                        }
                    }
                }
            }
        }
    }
};
