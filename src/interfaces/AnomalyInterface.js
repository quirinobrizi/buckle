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


const logger = require('../infrastructure/Logger');

module.exports = class AnomalyInterface {
  constructor(eventEmitter, anomalyService) {
    this.eventEmitter = eventEmitter;
    this.anomalyService = anomalyService;
  }

  receive(container) {
    this.anomalyService.process(container);
  }

  registerListener() {
    var self = this;
    logger.info("registering container realization listener")
    this.eventEmitter.on('container.realization.ready', evt => {
      self.receive(evt);
    });
  }
}