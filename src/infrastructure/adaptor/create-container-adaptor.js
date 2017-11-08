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

module.exports = class CreateContainerAdaptor {
  constructor() {}

  adapt(inputs, image, clusterId) {
    console.log("adapting container info for create container request");
    var labels = Object.assign({ 'org.buckle.version': '1' }, inputs.labels);
    var config = {
      Hostname: inputs.hostname,
      Domainname: inputs.domainName,
      User: inputs.user,
      AttachStdin: inputs.attachStdin || false,
      AttachStdout: inputs.attachStdout || true,
      AttachStderr: inputs.attachStderr || true,
      Tty: inputs.attachTty || false,
      Image: image,
      Env: inputs.environment,
      Cmd: inputs.command,
      WorkingDir: inputs.workingDir,
      Labels: labels,
      HostConfig: {
        LogConfig: {
          Type: 'json-file'
        }
      },
      Volumes: {},
      ExposedPorts: {},
      NetworkingConfig: {
        EndpointsConfig: {}
      }
    };
    if(inputs.network) {
      config.NetworkDisabled = false;
      config.HostConfig.NetworkMode = inputs.network;
      config.NetworkingConfig.EndpointsConfig[inputs.network] = {
        Links: [
          clusterId
        ]
      };
    }
    if(inputs.logConfiguration) {
      config.HostConfig.LogConfig.Type = inputs.logConfiguration.type || 'json-file';
      config.HostConfig.LogConfig.Config = inputs.logConfiguration.properties || {};
    }

    if(inputs.exposedPorts) {
      var exposedPorts = {};
      for (var i = 0; i < inputs.exposedPorts.length; i++) {
        var exposedPort = inputs.exposedPorts[i];
        exposedPorts[util.format("%s/%s", exposedPort.protocol, exposedPort.range)] = {};
      }
      config.ExposedPorts = exposedPorts;
    }
    if(inputs.volumes) {
      for (var i = 0; i < inputs.volumes.length; i++) {
        // TODO: QB is there anything more to map for volumes?? I belive so
        config.Volumes[inputs.volumes[i]] = {};
      }
    }
    if(inputs.kernelConfig) {
      for (var key in inputs.kernelConfig) {
        if (inputs.kernelConfig.hasOwnProperty(key)) {
          config.HostConfig[this._capitalize(key)] = inputs.kernelConfig[key];
        }
      }
    }

    console.log('generated configuration [%j]', config);
    return config;
  }

  _capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
