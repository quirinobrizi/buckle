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

const testObj = require('../../../../src/infrastructure/ai/metrics-helper');

describe('Metrics helper', function() {
  it('Calculate Unix CPU usage', function(done) {
    var current = {
      "cpu_usage" : {
        "percpu_usage" : [ 8646879, 24472255, 36438778, 30657443 ],
        "usage_in_usermode" : 50000000,
        "total_usage" : 100215355,
        "usage_in_kernelmode" : 30000000
      },
      "system_cpu_usage" : 739306590000000,
      "throttling_data" : {
        "periods" : 0,
        "throttled_periods" : 0,
        "throttled_time" : 0
      }
    };
    var pre = {
      "cpu_usage" : {
        "percpu_usage" : [ 8646879, 24350896, 36438778, 30657443 ],
        "usage_in_usermode" : 50000000,
        "total_usage" : 100093996,
        "usage_in_kernelmode" : 30000000
      },
      "system_cpu_usage" : 9492140000000,
      "throttling_data" : {
        "periods" : 0,
        "throttled_periods" : 0,
        "throttled_time" : 0
      }
    };
    var actual = testObj.calculateCpuUsageUnix(pre, current);
    actual.should.be.equal(6.651498884408222e-8);
    done();
  });

  it('calculate blockIO', function(done) {
    var inputs = {
      'io_service_bytes_recursive' : {
        '0' : {
          'op' : 'read',
          value : 50
        },
        '1' : {
          'op' : 'write',
          value : 10
        }
      }
    };

    var actual = testObj.calculateBlockIO(inputs);
    actual.should.be.eql({
      blkRead : 50,
      blkWrite : 10
    });
    done();
  });

  it('calculate network usage', function(done) {
    var inputs = {
      "eth0" : {
        "rx_bytes" : 5338,
        "rx_dropped" : 0,
        "rx_errors" : 0,
        "rx_packets" : 36,
        "tx_bytes" : 648,
        "tx_dropped" : 0,
        "tx_errors" : 0,
        "tx_packets" : 8
      },
      "eth5" : {
        "rx_bytes" : 4641,
        "rx_dropped" : 0,
        "rx_errors" : 0,
        "rx_packets" : 26,
        "tx_bytes" : 690,
        "tx_dropped" : 0,
        "tx_errors" : 0,
        "tx_packets" : 9
      }
    };
    var actual = testObj.calculateNetworkUsage(inputs);
    actual.should.be.eql({
      rx : 9979,
      tx : 1338
    });
    done();
  });

  it('calculate memory', function(done) {
    var inputs = {
      "stats" : {
        "total_pgmajfault" : 0,
        "cache" : 0,
        "mapped_file" : 0,
        "total_inactive_file" : 0,
        "pgpgout" : 414,
        "rss" : 6537216,
        "total_mapped_file" : 0,
        "writeback" : 0,
        "unevictable" : 0,
        "pgpgin" : 477,
        "total_unevictable" : 0,
        "pgmajfault" : 0,
        "total_rss" : 6537216,
        "total_rss_huge" : 6291456,
        "total_writeback" : 0,
        "total_inactive_anon" : 0,
        "rss_huge" : 6291456,
        "hierarchical_memory_limit" : 67108864,
        "total_pgfault" : 964,
        "total_active_file" : 0,
        "active_anon" : 6537216,
        "total_active_anon" : 6537216,
        "total_pgpgout" : 414,
        "total_cache" : 0,
        "inactive_anon" : 0,
        "active_file" : 0,
        "pgfault" : 964,
        "inactive_file" : 0,
        "total_pgpgin" : 477
      },
      "max_usage" : 6651904,
      "usage" : 6537216,
      "failcnt" : 0,
      "limit" : 67108864
    };
    var actual = testObj.calculateMemory(inputs);

    actual.should.be.eql({
      current : 6537216,
      max : 6651904,
      total : 67108864
    });

    done();
  });

  it('calculate cpu quota low usage', function(done) {
    var actual = testObj.calculateCpuQuota(0.16, 5000, 80000);
    actual.should.be.equal(5000);
    done();
  });

  it('calculate cpu quota high usage', function(done) {
    var actual = testObj.calculateCpuQuota(85, 5000, 80000);
    actual.should.be.equal(80000);
    done();
  });

  it('calculate cpu quota middle usage', function(done) {
    var actual = testObj.calculateCpuQuota(31.2, 5000, 80000);
    actual.should.be.equal(46800);
    done();
  });

  it('extract max value', function(done) {
    var actual = testObj.extractMax([{cpu:{current:31.2}}, {cpu:{current:5000}}, {cpu:{current:80000}}], value => { return value.cpu.current; });
    actual.should.be.equal(80000);
    done();
  });
})
