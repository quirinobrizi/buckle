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

const EurekaClient = require('eureka-client').Eureka;
const os = require('os');
const dns = require('dns');
const logger = require('./Logger');

module.exports = class Eureka {
  constructor(config) {
    this.config = config
    this.eurekaClient = null;
  };

  connect() {
    var ip = this.config.buckle.eureka.ip || '0.0.0.0';
    var port = 8080;// this.config.buckle.eureka.port || 10010;
    var hostName = os.hostname();
    var self = this;
    dns.lookup(hostName, { hints: dns.ADDRCONFIG }, function (err, resolvedIp) {
      console.log(hostName, err, resolvedIp);
      self.eurekaClient = new EurekaClient({
        instance: {
          app: self.config.buckle.eureka.name || 'buckle',
          hostName: hostName,
          ipAddr: ip || resolvedIp,
          statusPageUrl: 'http://' + hostName + ':' + port + '/info',
          port: {
            "$": port,
            "@enabled": "true"
          },
          securePort: {
            "$": 433,
            "@enabled": "false"
          },
          vipAddress: 'pcsc-api-gateway',
          dataCenterInfo: {
            '@class': "com.netflix.appinfo.MyDataCenterInfo",
            name: 'MyOwn'
          }
        },
        eureka: {
          serviceUrl: [
            'http://' + self.config.buckle.eureka.host + ':' + self.config.buckle.eureka.port + '/eureka/apps/'
          ]
        }
      });
      logger.info("Attemting connection to eureka [%s]", ip);
      self.eurekaClient.start();
    });
  };

};
