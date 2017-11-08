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
    get: function() {
        return [{
            conditions: {
                any: [{
                    fact: 'hostConfig',
                    operator: 'equal',
                    value: '',
                    path: '.CpuPeriod'
                }, {
                    fact: 'hostConfig',
                    operator: 'equal',
                    value: 0,
                    path: '.CpuQuota'
                }]
            },
            event: {
                type: 'cpu-limits-not-set',
                params: {
                    message: 'CPU limits have not been set'
                }
            }
        }, {
            conditions: {
                any: [{
                    fact: 'hostConfig',
                    operator: 'equal',
                    value: 0,
                    path: '.Memory'
                }]
            },
            event: {
                type: 'memory-limits-not-set',
                params: {
                    message: 'Memory limits have not been set'
                }
            }
        }, {
            conditions: {
                all: [{
                    fact: 'currentCpuLimit',
                    operator: 'differenceGreaterThan15Percent',
                    value: {
                        fact: 'lastCpuUsagePercentage',
                    }
                }, {
                    fact: 'currentCpuLimit',
                    operator: 'greaterThan',
                    value: 15
                }, {
                    fact: 'secondsSinceLastUpdate',
                    operator: 'greaterThan',
                    value: 60
                }]
            },
            event: {
                type: 'cpu-excess',
                param: {
                    message: 'Excess of assigned CPU'
                }
            }
        }, {
            conditions: {
                all: [{
                    fact: 'currentCpuLimit',
                    operator: 'differenceLessThan5Percent',
                    value: {
                        fact: 'lastCpuUsagePercentage',
                    }
                }, {
                    fact: 'currentCpuLimit',
                    operator: 'lessThanInclusive',
                    value: 95
                }, {
                    fact: 'currentCpuLimit',
                    operator: 'greaterThanInclusive',
                    value: 15
                }]
            },
            event: {
                type: 'cpu-saturated',
                param: {
                    message: 'Max CPU reached'
                }
            }
        }, {
            conditions: {
                all: [{
                    fact: 'lastMemoryUsage',
                    operator: 'differenceGreaterThan25Percent',
                    value: {
                        fact: 'currentMemoryLimit',
                    }
                }, {
                    fact: 'currentMemoryLimit',
                    operator: 'greaterThan',
                    value: 536870912
                }, {
                    fact: 'secondsSinceLastUpdate',
                    operator: 'greaterThan',
                    value: 60
                }]
            },
            event: {
                type: 'memory-excess',
                param: {
                    message: 'Excess of assigned memory'
                }
            }
        }, {
            conditions: {
                all: [{
                    fact: 'currentMemoryLimit',
                    operator: 'lessThanInclusive',
                    value: {
                        fact: 'lastMemoryUsage',
                    }
                }]
            },
            event: {
                type: 'memory-saturated',
                param: {
                    message: 'Max memory reached'
                }
            }
        }, {
            conditions: {
                any: [{
                    fact: 'cpuStats',
                    operator: 'greaterThan',
                    path: '.throttling_data.periods',
                    value: 0
                }, {
                    fact: 'cpuStats',
                    operator: 'greaterThan',
                    path: '.throttling_data.throttled_periods',
                    value: 0
                }, {
                    fact: 'cpuStats',
                    operator: 'greaterThan',
                    path: '.throttling_data.throttled_time',
                    value: 0
                }]
            },
            event: {
                type: 'cpu-throttled',
                param: {
                    message: 'Allocated CPU has been exceeded'
                }
            }
        }]
    }
};
