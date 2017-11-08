#!/usr/bin/env node

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

const format = require('util').format;

const Virtualbox = require('./Virtualbox');

module.exports = class DriverFactory {

    constructor() {
        this.drivers = {
            'virtualbox': new Virtualbox()
        }
    }

    /**
     * Provide a river instance.
     * @param {string} driver the driver type
     * @return {any} a driver instance
     */
    get(driver) {
        if (driver in this.drivers) {
            return this.drivers[driver];
        }
        throw Error(format("requested driver is not supported, allowed drivers: %s", Object.keys(this.drivers).join(', ')))
    }
};
