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
const assert = require('assert');

const Container = require('../../../src/domain/model/Container');
const Realization = require('../../../src/domain/model/Realization');
const Node = require('../../../src/domain/model/Node');

describe('Container', function () {
    it('evaluate anomalies by prefix', function () {
        var testObj = new Container("1", "1", "image");
        testObj.setAnomalies([{
            type: "cpu-excess"
        }, {
            type: "memory-excess"
        }]);
        var actual = testObj.hasAnomaliesOfType("cpu");
        actual.should.be.true;
    });
    it('evaluate anomalies by prefix, anomaly does not exists', function () {
        var testObj = new Container("1", "1", "image");
        testObj.setAnomalies([{
            type: "cpu-excess"
        }, {
            type: "memory-excess"
        }]);
        var actual = testObj.hasAnomaliesOfType("abcd");
        actual.should.be.false;
    });
    it('evaluate anomalies by full match', function () {
        var testObj = new Container("1", "1", "image");
        testObj.setAnomalies([{
            type: "cpu-excess"
        }, {
            type: "memory-excess"
        }]);
        var actual = testObj.hasAnomaliesOfType("cpu-excess");
        actual.should.be.true;
    });

    it('builds required limits', function (done) {
        var testObj = new Container("1", "1", "image").setStatus("running");
        testObj.setHostConfig({});
        var actual = testObj.buildLimitsConfiguration({
            cpu: 15000,
            memory: 6537216
        });
        actual.should.be.eql({
            CpuPeriod: 100000,
            CpuQuota: 15000,
            MemoryReservation: 268435456,
            Memory: 536870912,
            MemorySwappiness: 0,
            MemorySwap: 805306368
        });
        done();
    });

    it('calculate CPU quota for saturated cpu anomalies', function () {
        var testObj = new Container("1", "1", "image").setStatus("running");
        testObj.setAnomalies([{
            type: "cpu-saturated"
        }]);
        var st1 = new Realization("1", "1");
        st1.setCpu({
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
        testObj.setRealization([
            st1
        ]);
        testObj.setHostConfig({});
        var actual = testObj.calculateRequiredCpuQuota();
        actual.should.be.eql(82213);
    });

    it('calculate memory for saturated memory anomalies', function () {
        var testObj = new Container("1", "1", "image").setStatus("running");
        testObj.setAnomalies([{
            type: "memory-saturated"
        }]);
        var st1 = new Realization("1", "1");
        st1.setMemory({
            current: 6537216,
            max: 776651904,
            limit: 67108864
        })
        testObj.setRealization([
            st1
        ]);
        testObj.setHostConfig({});
        var actual = testObj.calculateRequiredMemory();
        actual.should.be.eql(6537216);
    });

    it('calculate CPU quota for execc cpu anomalies', function () {
        var testObj = new Container("1", "1", "image").setStatus("running");
        testObj.setAnomalies([{
            type: "cpu-excess"
        }]);
        var st1 = new Realization("1", "1");
        st1.setCpu({
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
        var st2 = new Realization("1", "1");
        st2.setCpu({
            current: {
                "cpu_usage": {
                    "percpu_usage": [8646879, 24472255, 36438778, 30657443],
                    "usage_in_usermode": 50000000,
                    "total_usage": 99993999915355,
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
        testObj.setRealization([
            st1, st2
        ]);
        testObj.setHostConfig({});
        var actual = testObj.calculateRequiredCpuQuota();
        actual.should.be.eql(82210);
    });

    it('calculate memory for excess memory anomalies', function () {
        var testObj = new Container("1", "1", "image").setStatus("running");
        testObj.setAnomalies([{
            type: "memory-excess"
        }]);
        var st1 = new Realization("1", "1");
        st1.setMemory({
            current: 6537216,
            max: 776651904,
            limit: 67108864
        })
        testObj.setRealization([
            st1
        ]);
        testObj.setHostConfig({});
        var actual = testObj.calculateRequiredMemory();
        actual.should.be.eql(6537216);
    });

    it('provides latest CPU usage', function (done) {
        var testObj = new Container("1", "1", "image");
        var st0 = new Realization("1", "1");
        st0.setCpu({
            current: {
                "cpu_usage": {
                    "percpu_usage": [8646879, 24472255, 36438778, 30657443],
                    "usage_in_usermode": 50000000,
                    "total_usage": 999999915355,
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
        st0.setMemory({
            current: 6537216,
            max: 776651904,
            limit: 67108864
        });
        var st1 = new Realization("1", "1");
        st1.setCpu({
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
        st1.setMemory({
            current: 6537216,
            max: 776651904,
            limit: 67108864
        });
        testObj.setRealization([
            st0,
            st1
        ]);
        var actual = testObj.getLatestCpuUsage();
        actual.should.be.equal(54.808396748712774);
        done();
    });

    it('validate node appartenence, success', function() {
        var testObj = new Container("1", "1", "1");
        testObj.setNode(new Node("1").setName("node-1"));
        // act
        assert.equal(true, testObj.isDeployedOnNode("node-1"));
    });

    it('validate node appartenence, failure', function() {
        var testObj = new Container("1", "1", "1");
        testObj.setNode(new Node("1").setName("node-1"));
        // act
        assert.equal(false, testObj.isDeployedOnNode("node-2"));
    });

    it('verifies if need to be updated, true', function() {
        var anomalies = [{
            type: 'cpu'
        }];
        var testObj = new Container("1", "1", "1")
            .setAnomalies(anomalies).setStatus('running');
        // act
        var actual = testObj.needToBeUpdated();
        // assert
        assert.ok(actual);
    });

    it('verifies if need to be updated, container not running', function() {
        var anomalies = [{
            type: 'cpu'
        }];
        var testObj = new Container("1", "1", "1")
            .setAnomalies(anomalies).setStatus('stopped');
        // act
        var actual = testObj.needToBeUpdated();
        // assert
        assert.ok(!actual);
    });

    it('verifies if need to be updated, no anomalies', function() {
        var anomalies = [];
        var testObj = new Container("1", "1", "1")
            .setAnomalies(anomalies).setStatus('running');
        // act
        var actual = testObj.needToBeUpdated();
        // assert
        assert.ok(!actual);
    });

    it('verifies if need to be updated, no anomalies of type memory or cpu', function() {
        var anomalies = [{
            type: 'another'
        }];
        var testObj = new Container("1", "1", "1")
            .setAnomalies(anomalies).setStatus('running');
        // act
        var actual = testObj.needToBeUpdated();
        // assert
        assert.ok(!actual);
    });
});
