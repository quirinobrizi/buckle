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

const util = require('util');
const adaptorHelper = require('./adaptor-helper');

module.exports = class ComposeAdaptor {
  constructor() {
    this.parsers = {
      1: this._v1Parser,
      2: this._v2Parser,
      3: this._v3Parser,
    };
  }

  adapt(compose) {
    if(!compose.version) {
      return this._v1Parser(compose);
    }
    return this.parsers[compose.version](compose);
  }

  _v1Parser(compose) {
    var containers = [];
    var self = this;
    Object.keys(compose).forEach((key) => {
      var service = compose[key];
      containers.push({
        name: key,
        configuration: {
          Cmd: service.command,
          Entrypoint: service.entrypoint,
          Env: adaptorHelper.parseEnvironmentVariables(service.environment),
          ExposedPorts: adaptorHelper.parseExposedPorts(service.expose),
          Image: service.image,
          Labels: adaptorHelper.parseLabels(service.labels),
          StopSignal: service.stop_signal,
          HostConfig: {
            CgroupParent: service.cgroup_parent,
            Devices: [], // TODO: QB complete
            CapAdd: service.cap_add,
            CapDrop: service.cap_drop,
            Dns: Array.isArray(service.dns) ? service.dns : [service.dns],
            DnsSearch: Array.isArray(service.dns_search) ? service.dns : [service.dns_search],
            ExtraHosts: service.extra_hosts,
            Links: service.links,
            LogConfig: {
              Type: service.log_driver,
              Config: service.log_opt
            },
            NetworkMode: service.net,
            PortBindings: adaptorHelper.parsePortBindings(service.ports),
            SecurityOpt: service.security_opt,
            Ulimits: adaptorHelper.parseUlimits(service.ulimits)
          }
        }
      });
    });
    return containers;
  }

  _v2Parser(compose) {

  }

  _v3Parser(compose) {

  }
};
