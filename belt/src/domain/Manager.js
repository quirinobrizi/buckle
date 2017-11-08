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

module.exports = class Manager {

    /**
     * Create a new manager node representation
     * @method constructor
     * @param  {string}         name      the node name
     * @param  {boolean}        primary   a flag indicating if this is a primary manager node
     * @param  {string}         ipAddress the manager IP Address
     * @param  {number}         port      The manager port
     * @param  {Map.<String>}   tokens    The tokens issued by this managers
     * @return {Manager}              a new manager instances
     */
    constructor(name, primary, ipAddress, port, tokens) {
        this.name = name;
        this.primary = primary;
        this.ipAddress = ipAddress;
        this.port = port;
        this.tokens = tokens;
    }

    getName() {
        return this.name;
    }

    isPrimary() {
        return this.primary;
    }

    getIpAddress() {
        return this.ipAddress;
    }

    getPort() {
        return this.port;
    }

    getTokens() {
        return this.tokens;
    }

    getManagerToken() {
        return this.tokens.get('manager');
    }

    getWorkerToken() {
        return this.tokens.get('node');
    }
};
