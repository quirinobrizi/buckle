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

const RulesEngine = require('json-rules-engine').Engine;
const factsExtractor = require('./FactsExtractor');
const operators = require('./Operators');
const rules = require('./Rules');
const logger = require('../../Logger');

module.exports = class AnomalyAnalyzer {
  constructor() {
    this.ruleEngine = new RulesEngine(rules.get());

    this.ruleEngine.addFact('hostConfig', factsExtractor.hostConfig);
    this.ruleEngine.addFact('memoryStats', factsExtractor.memoryStats);
    this.ruleEngine.addFact('cpuStats', factsExtractor.cpuStats);
    this.ruleEngine.addFact('lastCpuUsagePercentage', factsExtractor.lastCpuUsagePercentage);
    this.ruleEngine.addFact('currentCpuUsagePercentage', factsExtractor.currentCpuUsagePercentage);
    this.ruleEngine.addFact('currentCpuLimit', factsExtractor.currentCpuLimit);
    this.ruleEngine.addFact('lastMemoryUsage', factsExtractor.lastMemoryUsage);
    this.ruleEngine.addFact('currentMemoryLimit', factsExtractor.currentMemoryLimit);
    this.ruleEngine.addFact('secondsSinceLastUpdate', factsExtractor.secondsSinceLastUpdate);

    this.ruleEngine.addOperator('differenceGreaterThan25Percent', operators.differenceGreaterThan25Percent);
    this.ruleEngine.addOperator('differenceGreaterThan15Percent', operators.differenceGreaterThan15Percent);
    this.ruleEngine.addOperator('differenceLessThan5Percent', operators.differenceLessThan5Percent);

    this.ruleEngine.on('failure', (event, almanac, ruleResult) => {
      if (logger.debug) {
        logger.debug("rule evaluation failed: almanac %s, result %s", JSON.stringify(almanac), JSON.stringify(ruleResult));
      }
    });
  }

  analyze(container) {
    var self = this;
    logger.debug("analyzing container %s", container);
    return new Promise((resolve, reject) => {
      self.ruleEngine.run(container).then(resolve).catch(reject);
    });
  }
};
