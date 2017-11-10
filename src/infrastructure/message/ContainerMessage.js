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

module.exports = class ContainerMessage {

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.realizations = null;
        this.anomalies = null;
        this.status = null;
        this.state = null;
        this.created = null;
        this.networkMode = null;
        this.ipAddress =  null;
        this.image = null;
        this.version = null;

        this.config = null;
        this.hostConfig = null;
    }

    setConfig(config) {
        this.config = config;
        return this;
    }

    setHostConfig(hostConfig) {
        this.hostConfig = hostConfig;
        return this;
    }

    setStatus(status) {
        this.status = status;
        return this;
    }

    setState(state) {
        this.state = state;
        return this;
    }

    setCreated(created) {
        this.created = created;
        return this;
    }
    setNetworkMode(networkMode) {
        this.networkMode = networkMode;
        return this;
    }
    setImage(image) {
        this.image = image;
        return this;
    }

    setVersion(version) {
        this.version = version;
        return this;
    }

    setIpAddress(ipAddress) {
        this.ipAddress = ipAddress;
        return this;
    }
    setRealizations(realizations) {
        this.realizations = realizations;
        return this;
    }
    setAnomalies(anomalies) {
        this.anomalies = anomalies;
        return this;
    }
}
