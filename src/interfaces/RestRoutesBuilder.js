/*******************************************************************************
 * Copyright [2017] [Quirino Brizi (quirino.brizi@gmail.com)]
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http:// www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

'use strict'

const express = require('express');
const passport = require('passport');

const logger = require('../infrastructure/Logger');
const apiBuildersProvider = require('./api/ApiBuildersProvider');

module.exports = class RestRoutesBuilder {
  /**
     * Create and configure a new instance of RestApiRouter
     *
     * @constructor
     */
  constructor(eventEmitter, dockerRegistryClient, dockerEngineClient) {
    this.eventEmitter = eventEmitter;
    this.dockerRegistryClient = dockerRegistryClient;
    this.dockerEngineClient = dockerEngineClient;

    this.interfaces = ['clusterInterface', 'identityInterface', 'environmentInterface'];
  }

  /**
     * Scan the defined API builders and build each API.
     *
     */
  _defineRoutes(router, authentication) {
    apiBuildersProvider.apiBuilders(this.dockerEngineClient, this.dockerRegistryClient, this.eventEmitter)
      .forEach(builder => {
        logger.debug("build new set of APIs");
        builder.buildApis(router, authentication);
      });
  }

  buildRoutes(container, router, authentication) {
    for (let _interface of this.interfaces) {
      container.resolve(_interface).buildApis(router, authentication);
    }
    this._defineRoutes(router, authentication);
  }
};
