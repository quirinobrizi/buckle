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

const Realization = require('../../../src/domain/model/Realization');

describe('Realization', function () {
    it('evaluate CPU usage', function (done) {
        var testObj = new Realization("cid", "cname");
        testObj.setCpu({
            current: {
                "cpu_usage": {
                    "percpu_usage": [8646879, 24472255, 36438778, 30657443],
                    "usage_in_usermode": 50000000,
                    "total_usage": 99999999915355,
                    "usage_in_kernelmode": 30000000
                },
                "system_cpu_usage": 739306590000000,
                "throttling_data": {
                    "periods": 0,
                    "throttled_periods": 0,
                    "throttled_time": 0
                }
            },
            previous: {
                "cpu_usage": {
                    "percpu_usage": [8646879, 24350896, 36438778, 30657443],
                    "usage_in_usermode": 50000000,
                    "total_usage": 100093996,
                    "usage_in_kernelmode": 30000000
                },
                "system_cpu_usage": 9492140000000,
                "throttling_data": {
                    "periods": 0,
                    "throttled_periods": 0,
                    "throttled_time": 0
                }
            }
        });
        testObj.setMemory({
            current: 6537216,
            max: 776651904,
            limit: 67108864
        });
        testObj.calculateCpuUsageUnix().should.be.equal(54.808396748712774);
        done();
    });

    it('provide memory info', function (done) {
        var testObj = new Realization("cid", "cname");
        var expected = {
            current: 6537216,
            max: 776651904,
            limit: 67108864
        };
        testObj.setMemory(expected);
        testObj.getMemory().should.be.eql(expected);
        done();
    });

    it('calculate network info', function (done) {
        var testObj = new Realization("cid", "cname");
        var expected = {
            rx: 9979,
            tx: 1338
        };
        testObj.setNetworks({
             "eth0": {
                 "rx_bytes": 5338,
                 "rx_dropped": 0,
                 "rx_errors": 0,
                 "rx_packets": 36,
                 "tx_bytes": 648,
                 "tx_dropped": 0,
                 "tx_errors": 0,
                 "tx_packets": 8
             },
             "eth5": {
                 "rx_bytes": 4641,
                 "rx_dropped": 0,
                 "rx_errors": 0,
                 "rx_packets": 26,
                 "tx_bytes": 690,
                 "tx_dropped": 0,
                 "tx_errors": 0,
                 "tx_packets": 9
             }
        });
        testObj.calculateNetworkUsage().should.be.eql(expected);
        done();
    });
});
