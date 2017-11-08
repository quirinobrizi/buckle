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

const Realization = require('../../domain/model/Realization');

module.exports = class RealizationTranslator {

  constructor() {

  }

  translate(stats) {
    try {
      return new Realization(stats.id, stats.name)
        .setTimestamp(Date.parse(stats.read))
        .setMemory({
          limit: stats['memory_stats'].limit,
          maxUsage: stats['memory_stats']['max_usage'],
          current: stats['memory_stats'].usage,
          failures: stats['memory_stats'].failcnt
        }).setCpu({
          'current': stats['cpu_stats'],
          'previous': stats['precpu_stats']
        }).setBlkio(stats['blkio_stats'])
        .setNetworks(stats.networks);
    } catch (e) {
      console.error(e);
    }
  }
}