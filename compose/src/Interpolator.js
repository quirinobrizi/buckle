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

const InterpolationException = require('./exception/InterpolationException');

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
            answer.push(this._doInterpolate(configuration, environment));
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
                    let match = /.*\$\{{0,1}([A-Z_]+)\}{0,1}/g.exec(value);
                    console.log("value %s matches regexp? %s", value, match);
                    if (match) {
                        let ev = match[1];
                        if(!environment.has(ev)) {
                            throw new InterpolationException("requested environemt variable " + ev + " is not defined");
                        }
                        let envNoBrackets = util.format("$%s", ev);
                        let envWithBrackets = util.format("${%s}", ev);
                        let envValue = environment.get(ev);
                        if (value === envNoBrackets) {
                            result = envValue;
                        } else if (value === envWithBrackets) {
                            result = envValue;
                        } else if (value.includes(envNoBrackets)) {
                            result = value.replace(envNoBrackets, envValue);
                        } else if (value.includes(envWithBrackets)) {
                            result = value.replace(envWithBrackets, envValue);
                        }
                    } else {
                        result = value;
                    }
                }
                configuration[key] = result;
            }
        }
        return configuration;
    }
};
