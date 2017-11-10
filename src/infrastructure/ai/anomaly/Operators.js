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

const logger = require('../../Logger');

module.exports = {

    differenceGreaterThan15Percent: function (fact, compare) {
        var percentage = ((fact > compare) ? fact - compare : compare - fact) / ((fact + compare) / 2) * 100;
        logger.debug("fact value %s, compare value %s, difference percentage %s", fact, compare, percentage);
        return percentage > 15;
    },

    differenceGreaterThan25Percent: function (fact, compare) {
        var percentage = ((fact > compare) ? fact - compare : compare - fact) / ((fact + compare) / 2) * 100;
        logger.debug("fact value %s, compare value %s, difference percentage %s", fact, compare, percentage);
        return percentage > 25;
    },

    differenceLessThan5Percent: function (fact, compare) {
        var percentage = ((fact > compare) ? fact - compare : compare - fact) / ((fact + compare) / 2) * 100;
        logger.debug("fact value %s, compare value %s, difference percentage %s", fact, compare, percentage);
        return percentage < 5;
    },

    diffrencePercentage: function (a, b) {
    }
}
