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

module.exports = {

  ONE_SEC_IN_JIFFY: 100000,

  calculateCpuQuota(cpu, minQuota, maxQuota) {
    // max CPU is given as a percentage
    var currentRequiredQuota = (this.ONE_SEC_IN_JIFFY * cpu) / 100;
    // increase quota of 50%
    var quota = 2 * currentRequiredQuota; // + ((currentRequiredQuota * 50) / 100);
    var answer = (quota < minQuota) ? minQuota : quota;
    return Math.round((answer > maxQuota) ? maxQuota : answer);
  },


  calculateMemoryReservation: function (current, increment, minimum) {
    var answer = Math.round(current + (current * increment) / 100);
    return answer > minimum ? answer : minimum;
  },

  extractMax: function (collection, extractor) {
    var max = extractor(collection[0]);
    for (var i = 1; i < collection.length; i++) {
      var current = extractor(collection[i]);
      if (current > max) {
        max = current;
      }
    }
    return max;
  },

  extractMin: function (collection, extractor) {
    var min = extractor(collection[0]);
    for (var i = 1; i < collection.length; i++) {
      var current = extractor(collection[i]);
      if (current < min) {
        min = current;
      }
    }
    return min;
  },

  calculateAverage: function (collection, extractor) {
    var sum = 0;
    for (var i = 0; i < collection.length; i++) {
      sum += extractor(collection[i]);
    }
    return sum / collection.length;
  }

};
