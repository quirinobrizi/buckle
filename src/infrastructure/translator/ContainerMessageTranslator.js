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

const ContainerMessage = require('../message/ContainerMessage');
const AnomaliesMessageTranslator = require('./AnomaliesMessageTranslator');
const RealizationMessageTranslator = require('./RealizationMessageTranslator');

module.exports = class ContainerMessageTranslator {

    constructor() {
        this.anomaliesMessageTranslator = new AnomaliesMessageTranslator();
        this.realizationMessageTranslator = new RealizationMessageTranslator();
    }

    /**
     * Translate the model Container object to ContainerMessage.
     * @param  {Container} container the model object
     * @return {ContainerMessage} the message exchanged with dexternal services
     */
    translate(container) {
        if(!container) {
            return null;
        }
        var realizations = this.realizationMessageTranslator.translate(container.getRealizations());
        var anomalies = this.anomaliesMessageTranslator.translate(container.getAnomalies());
        return new ContainerMessage(container.getContainerId(), container.getName())
            .setStatus(container.getStatus())
            .setState(container.getState())
            .setCreated(container.getCreatedTimestamp())
            .setNetworkMode(container.getNetworkMode())
            .setImage(container.containerImage())
            .setVersion(container.containerVersion())
            .setIpAddress(container.getIpAddress())
            .setRealizations(realizations)
            .setAnomalies(anomalies)
            .setConfig(container.getConfig())
            .setHostConfig(container.getHostConfig());
    }
}
