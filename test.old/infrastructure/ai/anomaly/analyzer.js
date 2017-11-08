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

const AnomalyAnalyzer = require('../../../../../src/infrastructure/ai/anomaly/analyzer');
const testObj = new AnomalyAnalyzer();

describe('Analizer', function() {
  it('Validate limit not set rule', function(done) {
    var container = {
      "read": "2015-01-08T22:57:31.547920715Z",
      "pids_stats": {
        "current": 3
      },
      "networks": {
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
      },
      "memory_stats": {
        "stats": {
          "total_pgmajfault": 0,
          "cache": 0,
          "mapped_file": 0,
          "total_inactive_file": 0,
          "pgpgout": 414,
          "rss": 6537216,
          "total_mapped_file": 0,
          "writeback": 0,
          "unevictable": 0,
          "pgpgin": 477,
          "total_unevictable": 0,
          "pgmajfault": 0,
          "total_rss": 6537216,
          "total_rss_huge": 6291456,
          "total_writeback": 0,
          "total_inactive_anon": 0,
          "rss_huge": 6291456,
          "hierarchical_memory_limit": 67108864,
          "total_pgfault": 964,
          "total_active_file": 0,
          "active_anon": 6537216,
          "total_active_anon": 6537216,
          "total_pgpgout": 414,
          "total_cache": 0,
          "inactive_anon": 0,
          "active_file": 0,
          "pgfault": 964,
          "inactive_file": 0,
          "total_pgpgin": 477
        },
        "max_usage": 6651904,
        "usage": 6537216,
        "failcnt": 0,
        "limit": 67108864
      },
      "blkio_stats": {},
      "cpu_stats": {
        "cpu_usage": {
          "percpu_usage": [
            8646879,
            24472255,
            36438778,
            30657443
          ],
          "usage_in_usermode": 50000000,
          "total_usage": 100215355,
          "usage_in_kernelmode": 30000000
        },
        "system_cpu_usage": 739306590000000,
        "online_cpus": 4,
        "throttling_data": {
          "periods": 0,
          "throttled_periods": 0,
          "throttled_time": 0
        }
      },
      "precpu_stats": {
        "cpu_usage": {
          "percpu_usage": [
            8646879,
            24350896,
            36438778,
            30657443
          ],
          "usage_in_usermode": 50000000,
          "total_usage": 100093996,
          "usage_in_kernelmode": 30000000
        },
        "system_cpu_usage": 9492140000000,
        "online_cpus": 4,
        "throttling_data": {
          "periods": 0,
          "throttled_periods": 0,
          "throttled_time": 0
        }
      },

      "AppArmorProfile": "",
      "Args": [
        "-c",
        "exit 9"
      ],
      "Config": {
        "AttachStderr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [
          "/bin/sh",
          "-c",
          "exit 9"
        ],
        "Domainname": "",
        "Env": [
          "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        ],
        "Hostname": "ba033ac44011",
        "Image": "ubuntu",
        "Labels": {
          "com.example.vendor": "Acme",
          "com.example.license": "GPL",
          "com.example.version": "1.0"
        },
        "MacAddress": "",
        "NetworkDisabled": false,
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "User": "",
        "Volumes": {
          "/volumes/data": {}
        },
        "WorkingDir": "",
        "StopSignal": "SIGTERM",
        "StopTimeout": 10
      },
      "Created": "2015-01-06T15:47:31.485331387Z",
      "Driver": "devicemapper",
      "HostConfig": {
        "MaximumIOps": 0,
        "MaximumIOBps": 0,
        "BlkioWeight": 0,
        "BlkioWeightDevice": [
          {}
        ],
        "BlkioDeviceReadBps": [
          {}
        ],
        "BlkioDeviceWriteBps": [
          {}
        ],
        "BlkioDeviceReadIOps": [
          {}
        ],
        "BlkioDeviceWriteIOps": [
          {}
        ],
        "ContainerIDFile": "",
        "CpusetCpus": "",
        "CpusetMems": "",
        "CpuPercent": 0,
        "CpuShares": 0,
        "CpuPeriod": '',
        "CpuRealtimePeriod": 0,
        "CpuRealtimeRuntime": 0,
        "CpuQuota": 0,
        "Devices": [],
        "IpcMode": "",
        "LxcConf": [],
        "Memory": 0,
        "MemorySwap": 0,
        "MemoryReservation": 0,
        "KernelMemory": 0,
        "OomKillDisable": false,
        "OomScoreAdj": 500,
        "NetworkMode": "bridge",
        "PidMode": "",
        "PortBindings": {},
        "Privileged": false,
        "ReadonlyRootfs": false,
        "PublishAllPorts": false,
        "RestartPolicy": {
          "MaximumRetryCount": 2,
          "Name": "on-failure"
        },
        "LogConfig": {
          "Type": "json-file"
        },
        "Sysctls": {
          "net.ipv4.ip_forward": "1"
        },
        "Ulimits": [
          {}
        ],
        "VolumeDriver": "",
        "ShmSize": 67108864
      },
      "HostnamePath": "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/hostname",
      "HostsPath": "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/hosts",
      "LogPath": "/var/lib/docker/containers/1eb5fabf5a03807136561b3c00adcd2992b535d624d5e18b6cdc6a6844d9767b/1eb5fabf5a03807136561b3c00adcd2992b535d624d5e18b6cdc6a6844d9767b-json.log",
      "Id": "ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39",
      "Image": "04c5d3b7b0656168630d3ba35d8889bd0e9caafcaeb3004d2bfbc47e7c5d35d2",
      "MountLabel": "",
      "Name": "/boring_euclid",
      "NetworkSettings": {
        "Bridge": "",
        "SandboxID": "",
        "HairpinMode": false,
        "LinkLocalIPv6Address": "",
        "LinkLocalIPv6PrefixLen": 0,
        "SandboxKey": "",
        "SecondaryIPAddresses": null,
        "SecondaryIPv6Addresses": null,
        "EndpointID": "",
        "Gateway": "",
        "GlobalIPv6Address": "",
        "GlobalIPv6PrefixLen": 0,
        "IPAddress": "",
        "IPPrefixLen": 0,
        "IPv6Gateway": "",
        "MacAddress": "",
        "Networks": {
          "bridge": {
            "NetworkID": "7ea29fc1412292a2d7bba362f9253545fecdfa8ce9a6e37dd10ba8bee7129812",
            "EndpointID": "7587b82f0dada3656fda26588aee72630c6fab1536d36e394b2bfbcf898c971d",
            "Gateway": "172.17.0.1",
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "MacAddress": "02:42:ac:12:00:02"
          }
        }
      },
      "Path": "/bin/sh",
      "ProcessLabel": "",
      "ResolvConfPath": "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/resolv.conf",
      "RestartCount": 1,
      "State": {
        "Error": "",
        "ExitCode": 9,
        "FinishedAt": "2015-01-06T15:47:32.080254511Z",
        "OOMKilled": false,
        "Dead": false,
        "Paused": false,
        "Pid": 0,
        "Restarting": false,
        "Running": true,
        "StartedAt": "2015-01-06T15:47:32.072697474Z",
        "Status": "running"
      },
      "Mounts": [
        {
          "Name": "fac362...80535",
          "Source": "/data",
          "Destination": "/data",
          "Driver": "local",
          "Mode": "ro,Z",
          "RW": false,
          "Propagation": ""
        }
      ],
      "statistics": [{
        cpu: {
          current: -10
        },
        memory: {
          total: 100000
        }
      }]
    };
    testObj.analyze(container).then(facts => {
      var actual = facts.filter(el => { return el.type === 'cpu-limits-not-set' || el.type === 'memory-limits-not-set'});
      actual.length.should.be.equal(2);
      done();
    });
  });

  // it('Validate cpu spike rule', function(done) {
  // var container = {
  // "read": "2015-01-08T22:57:31.547920715Z",
  // "pids_stats": {
  // "current": 3
  // },
  // "networks": {
  // "eth0": {
  // "rx_bytes": 5338,
  // "rx_dropped": 0,
  // "rx_errors": 0,
  // "rx_packets": 36,
  // "tx_bytes": 648,
  // "tx_dropped": 0,
  // "tx_errors": 0,
  // "tx_packets": 8
  // },
  // "eth5": {
  // "rx_bytes": 4641,
  // "rx_dropped": 0,
  // "rx_errors": 0,
  // "rx_packets": 26,
  // "tx_bytes": 690,
  // "tx_dropped": 0,
  // "tx_errors": 0,
  // "tx_packets": 9
  // }
  // },
  // "memory_stats": {
  // "stats": {
  // "total_pgmajfault": 0,
  // "cache": 0,
  // "mapped_file": 0,
  // "total_inactive_file": 0,
  // "pgpgout": 414,
  // "rss": 6537216,
  // "total_mapped_file": 0,
  // "writeback": 0,
  // "unevictable": 0,
  // "pgpgin": 477,
  // "total_unevictable": 0,
  // "pgmajfault": 0,
  // "total_rss": 6537216,
  // "total_rss_huge": 6291456,
  // "total_writeback": 0,
  // "total_inactive_anon": 0,
  // "rss_huge": 6291456,
  // "hierarchical_memory_limit": 67108864,
  // "total_pgfault": 964,
  // "total_active_file": 0,
  // "active_anon": 6537216,
  // "total_active_anon": 6537216,
  // "total_pgpgout": 414,
  // "total_cache": 0,
  // "inactive_anon": 0,
  // "active_file": 0,
  // "pgfault": 964,
  // "inactive_file": 0,
  // "total_pgpgin": 477
  // },
  // "max_usage": 6651904,
  // "usage": 6537216,
  // "failcnt": 0,
  // "limit": 67108864
  // },
  // "blkio_stats": {},
  // "cpu_stats": {
  // "cpu_usage": {
  // "percpu_usage": [
  // 8646879,
  // 24472255,
  // 36438778,
  // 30657443
  // ],
  // "usage_in_usermode": 50000000,
  // "total_usage": 191215355,
  // "usage_in_kernelmode": 30000000
  // },
  // "system_cpu_usage": 999306590000000,
  // "online_cpus": 4,
  // "throttling_data": {
  // "periods": 0,
  // "throttled_periods": 0,
  // "throttled_time": 0
  // }
  // },
  // "precpu_stats": {
  // "cpu_usage": {
  // "percpu_usage": [
  // 8646879,
  // 24350896,
  // 36438778,
  // 30657443
  // ],
  // "usage_in_usermode": 50000000,
  // "total_usage": 0,
  // "usage_in_kernelmode": 30000000
  // },
  // "system_cpu_usage": 999305590000000,
  // "online_cpus": 4,
  // "throttling_data": {
  // "periods": 0,
  // "throttled_periods": 0,
  // "throttled_time": 0
  // }
  // },
  //
  // "AppArmorProfile": "",
  // "Args": [
  // "-c",
  // "exit 9"
  // ],
  // "Config": {
  // "AttachStderr": true,
  // "AttachStdin": false,
  // "AttachStdout": true,
  // "Cmd": [
  // "/bin/sh",
  // "-c",
  // "exit 9"
  // ],
  // "Domainname": "",
  // "Env": [
  // "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
  // ],
  // "Hostname": "ba033ac44011",
  // "Image": "ubuntu",
  // "Labels": {
  // "com.example.vendor": "Acme",
  // "com.example.license": "GPL",
  // "com.example.version": "1.0"
  // },
  // "MacAddress": "",
  // "NetworkDisabled": false,
  // "OpenStdin": false,
  // "StdinOnce": false,
  // "Tty": false,
  // "User": "",
  // "Volumes": {
  // "/volumes/data": {}
  // },
  // "WorkingDir": "",
  // "StopSignal": "SIGTERM",
  // "StopTimeout": 10
  // },
  // "Created": "2015-01-06T15:47:31.485331387Z",
  // "Driver": "devicemapper",
  // "HostConfig": {
  // "MaximumIOps": 0,
  // "MaximumIOBps": 0,
  // "BlkioWeight": 0,
  // "BlkioWeightDevice": [
  // {}
  // ],
  // "BlkioDeviceReadBps": [
  // {}
  // ],
  // "BlkioDeviceWriteBps": [
  // {}
  // ],
  // "BlkioDeviceReadIOps": [
  // {}
  // ],
  // "BlkioDeviceWriteIOps": [
  // {}
  // ],
  // "ContainerIDFile": "",
  // "CpusetCpus": "",
  // "CpusetMems": "",
  // "CpuPercent": 0,
  // "CpuShares": 0,
  // "CpuPeriod": 100000,
  // "CpuRealtimePeriod": 0,
  // "CpuRealtimeRuntime": 0,
  // "CpuQuota": 50000,
  // "Devices": [],
  // "IpcMode": "",
  // "LxcConf": [],
  // "Memory": 100000,
  // "MemorySwap": 0,
  // "MemoryReservation": 80000,
  // "KernelMemory": 0,
  // "OomKillDisable": false,
  // "OomScoreAdj": 500,
  // "NetworkMode": "bridge",
  // "PidMode": "",
  // "PortBindings": {},
  // "Privileged": false,
  // "ReadonlyRootfs": false,
  // "PublishAllPorts": false,
  // "RestartPolicy": {
  // "MaximumRetryCount": 2,
  // "Name": "on-failure"
  // },
  // "LogConfig": {
  // "Type": "json-file"
  // },
  // "Sysctls": {
  // "net.ipv4.ip_forward": "1"
  // },
  // "Ulimits": [
  // {}
  // ],
  // "VolumeDriver": "",
  // "ShmSize": 67108864
  // },
  // "HostnamePath":
  // "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/hostname",
  // "HostsPath":
  // "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/hosts",
  // "LogPath":
  // "/var/lib/docker/containers/1eb5fabf5a03807136561b3c00adcd2992b535d624d5e18b6cdc6a6844d9767b/1eb5fabf5a03807136561b3c00adcd2992b535d624d5e18b6cdc6a6844d9767b-json.log",
  // "Id": "ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39",
  // "Image":
  // "04c5d3b7b0656168630d3ba35d8889bd0e9caafcaeb3004d2bfbc47e7c5d35d2",
  // "MountLabel": "",
  // "Name": "/boring_euclid",
  // "NetworkSettings": {
  // "Bridge": "",
  // "SandboxID": "",
  // "HairpinMode": false,
  // "LinkLocalIPv6Address": "",
  // "LinkLocalIPv6PrefixLen": 0,
  // "SandboxKey": "",
  // "SecondaryIPAddresses": null,
  // "SecondaryIPv6Addresses": null,
  // "EndpointID": "",
  // "Gateway": "",
  // "GlobalIPv6Address": "",
  // "GlobalIPv6PrefixLen": 0,
  // "IPAddress": "",
  // "IPPrefixLen": 0,
  // "IPv6Gateway": "",
  // "MacAddress": "",
  // "Networks": {
  // "bridge": {
  // "NetworkID":
  // "7ea29fc1412292a2d7bba362f9253545fecdfa8ce9a6e37dd10ba8bee7129812",
  // "EndpointID":
  // "7587b82f0dada3656fda26588aee72630c6fab1536d36e394b2bfbcf898c971d",
  // "Gateway": "172.17.0.1",
  // "IPAddress": "172.17.0.2",
  // "IPPrefixLen": 16,
  // "IPv6Gateway": "",
  // "GlobalIPv6Address": "",
  // "GlobalIPv6PrefixLen": 0,
  // "MacAddress": "02:42:ac:12:00:02"
  // }
  // }
  // },
  // "Path": "/bin/sh",
  // "ProcessLabel": "",
  // "ResolvConfPath":
  // "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/resolv.conf",
  // "RestartCount": 1,
  // "State": {
  // "Error": "",
  // "ExitCode": 9,
  // "FinishedAt": "2015-01-06T15:47:32.080254511Z",
  // "OOMKilled": false,
  // "Dead": false,
  // "Paused": false,
  // "Pid": 0,
  // "Restarting": false,
  // "Running": true,
  // "StartedAt": "2015-01-06T15:47:32.072697474Z",
  // "Status": "running"
  // },
  // "Mounts": [
  // {
  // "Name": "fac362...80535",
  // "Source": "/data",
  // "Destination": "/data",
  // "Driver": "local",
  // "Mode": "ro,Z",
  // "RW": false,
  // "Propagation": ""
  // }
  // ],
  // "statistics": [{
  // cpu: {
  // current: 2
  // },
  // memory: {
  // total: 100000
  // }
  // }]
  // };
  // testObj.analyze(container).then(facts => {
  // var actual = facts.filter(el => { return el.type === 'cpu-spike'});
  // actual.length.should.be.equal(1);
  // done();
  // });
  // });

  it('Validate cpu excess rule', function(done) {
    var container = {
      "read": "2015-01-08T22:57:31.547920715Z",
      "pids_stats": {
        "current": 3
      },
      "networks": {
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
      },
      "memory_stats": {
        "stats": {
          "total_pgmajfault": 0,
          "cache": 0,
          "mapped_file": 0,
          "total_inactive_file": 0,
          "pgpgout": 414,
          "rss": 6537216,
          "total_mapped_file": 0,
          "writeback": 0,
          "unevictable": 0,
          "pgpgin": 477,
          "total_unevictable": 0,
          "pgmajfault": 0,
          "total_rss": 6537216,
          "total_rss_huge": 6291456,
          "total_writeback": 0,
          "total_inactive_anon": 0,
          "rss_huge": 6291456,
          "hierarchical_memory_limit": 67108864,
          "total_pgfault": 964,
          "total_active_file": 0,
          "active_anon": 6537216,
          "total_active_anon": 6537216,
          "total_pgpgout": 414,
          "total_cache": 0,
          "inactive_anon": 0,
          "active_file": 0,
          "pgfault": 964,
          "inactive_file": 0,
          "total_pgpgin": 477
        },
        "max_usage": 6651904,
        "usage": 6537216,
        "failcnt": 0,
        "limit": 67108864
      },
      "blkio_stats": {},
      "cpu_stats": {
        "cpu_usage": {
          "percpu_usage": [
            8646879,
            24472255,
            36438778,
            30657443
          ],
          "usage_in_usermode": 50000000,
          "total_usage": 191215355,
          "usage_in_kernelmode": 30000000
        },
        "system_cpu_usage": 999306590000000,
        "online_cpus": 4,
        "throttling_data": {
          "periods": 0,
          "throttled_periods": 0,
          "throttled_time": 0
        }
      },
      "precpu_stats": {
        "cpu_usage": {
          "percpu_usage": [
            8646879,
            24350896,
            36438778,
            30657443
          ],
          "usage_in_usermode": 50000000,
          "total_usage": 0,
          "usage_in_kernelmode": 30000000
        },
        "system_cpu_usage": 999305590000000,
        "online_cpus": 4,
        "throttling_data": {
          "periods": 0,
          "throttled_periods": 0,
          "throttled_time": 0
        }
      },

      "AppArmorProfile": "",
      "Args": [
        "-c",
        "exit 9"
      ],
      "Config": {
        "AttachStderr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [
          "/bin/sh",
          "-c",
          "exit 9"
        ],
        "Domainname": "",
        "Env": [
          "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        ],
        "Hostname": "ba033ac44011",
        "Image": "ubuntu",
        "Labels": {
          "com.example.vendor": "Acme",
          "com.example.license": "GPL",
          "com.example.version": "1.0"
        },
        "MacAddress": "",
        "NetworkDisabled": false,
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "User": "",
        "Volumes": {
          "/volumes/data": {}
        },
        "WorkingDir": "",
        "StopSignal": "SIGTERM",
        "StopTimeout": 10
      },
      "Created": "2015-01-06T15:47:31.485331387Z",
      "Driver": "devicemapper",
      "HostConfig": {
        "MaximumIOps": 0,
        "MaximumIOBps": 0,
        "BlkioWeight": 0,
        "BlkioWeightDevice": [
          {}
        ],
        "BlkioDeviceReadBps": [
          {}
        ],
        "BlkioDeviceWriteBps": [
          {}
        ],
        "BlkioDeviceReadIOps": [
          {}
        ],
        "BlkioDeviceWriteIOps": [
          {}
        ],
        "ContainerIDFile": "",
        "CpusetCpus": "",
        "CpusetMems": "",
        "CpuPercent": 0,
        "CpuShares": 0,
        "CpuPeriod": 100000,
        "CpuRealtimePeriod": 0,
        "CpuRealtimeRuntime": 0,
        "CpuQuota": 50000,
        "Devices": [],
        "IpcMode": "",
        "LxcConf": [],
        "Memory": 100000,
        "MemorySwap": 0,
        "MemoryReservation": 80000,
        "KernelMemory": 0,
        "OomKillDisable": false,
        "OomScoreAdj": 500,
        "NetworkMode": "bridge",
        "PidMode": "",
        "PortBindings": {},
        "Privileged": false,
        "ReadonlyRootfs": false,
        "PublishAllPorts": false,
        "RestartPolicy": {
          "MaximumRetryCount": 2,
          "Name": "on-failure"
        },
        "LogConfig": {
          "Type": "json-file"
        },
        "Sysctls": {
          "net.ipv4.ip_forward": "1"
        },
        "Ulimits": [
          {}
        ],
        "VolumeDriver": "",
        "ShmSize": 67108864
      },
      "HostnamePath": "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/hostname",
      "HostsPath": "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/hosts",
      "LogPath": "/var/lib/docker/containers/1eb5fabf5a03807136561b3c00adcd2992b535d624d5e18b6cdc6a6844d9767b/1eb5fabf5a03807136561b3c00adcd2992b535d624d5e18b6cdc6a6844d9767b-json.log",
      "Id": "ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39",
      "Image": "04c5d3b7b0656168630d3ba35d8889bd0e9caafcaeb3004d2bfbc47e7c5d35d2",
      "MountLabel": "",
      "Name": "/boring_euclid",
      "NetworkSettings": {
        "Bridge": "",
        "SandboxID": "",
        "HairpinMode": false,
        "LinkLocalIPv6Address": "",
        "LinkLocalIPv6PrefixLen": 0,
        "SandboxKey": "",
        "SecondaryIPAddresses": null,
        "SecondaryIPv6Addresses": null,
        "EndpointID": "",
        "Gateway": "",
        "GlobalIPv6Address": "",
        "GlobalIPv6PrefixLen": 0,
        "IPAddress": "",
        "IPPrefixLen": 0,
        "IPv6Gateway": "",
        "MacAddress": "",
        "Networks": {
          "bridge": {
            "NetworkID": "7ea29fc1412292a2d7bba362f9253545fecdfa8ce9a6e37dd10ba8bee7129812",
            "EndpointID": "7587b82f0dada3656fda26588aee72630c6fab1536d36e394b2bfbcf898c971d",
            "Gateway": "172.17.0.1",
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "MacAddress": "02:42:ac:12:00:02"
          }
        }
      },
      "Path": "/bin/sh",
      "ProcessLabel": "",
      "ResolvConfPath": "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/resolv.conf",
      "RestartCount": 1,
      "State": {
        "Error": "",
        "ExitCode": 9,
        "FinishedAt": "2015-01-06T15:47:32.080254511Z",
        "OOMKilled": false,
        "Dead": false,
        "Paused": false,
        "Pid": 0,
        "Restarting": false,
        "Running": true,
        "StartedAt": "2015-01-06T15:47:32.072697474Z",
        "Status": "running"
      },
      "Mounts": [
        {
          "Name": "fac362...80535",
          "Source": "/data",
          "Destination": "/data",
          "Driver": "local",
          "Mode": "ro,Z",
          "RW": false,
          "Propagation": ""
        }
      ],
      "statistics": [{
        cpu: {
          current: 2
        },
        memory: {
          total: 100000
        }
      }]
    };
    testObj.analyze(container).then(facts => {
      var actual = facts.filter(el => { return el.type === 'cpu-excess'});
      actual.length.should.be.equal(1);
      done();
    });
  });

  it('Validate cpu saturated rule', function(done) {
    var container = {
      "read": "2015-01-08T22:57:31.547920715Z",
      "pids_stats": {
        "current": 3
      },
      "networks": {
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
      },
      "memory_stats": {
        "stats": {
          "total_pgmajfault": 0,
          "cache": 0,
          "mapped_file": 0,
          "total_inactive_file": 0,
          "pgpgout": 414,
          "rss": 6537216,
          "total_mapped_file": 0,
          "writeback": 0,
          "unevictable": 0,
          "pgpgin": 477,
          "total_unevictable": 0,
          "pgmajfault": 0,
          "total_rss": 6537216,
          "total_rss_huge": 6291456,
          "total_writeback": 0,
          "total_inactive_anon": 0,
          "rss_huge": 6291456,
          "hierarchical_memory_limit": 67108864,
          "total_pgfault": 964,
          "total_active_file": 0,
          "active_anon": 6537216,
          "total_active_anon": 6537216,
          "total_pgpgout": 414,
          "total_cache": 0,
          "inactive_anon": 0,
          "active_file": 0,
          "pgfault": 964,
          "inactive_file": 0,
          "total_pgpgin": 477
        },
        "max_usage": 6651904,
        "usage": 6537216,
        "failcnt": 0,
        "limit": 67108864
      },
      "blkio_stats": {},
      "cpu_stats": {
        "cpu_usage": {
          "percpu_usage": [
            8646879,
            24472255,
            36438778,
            30657443
          ],
          "usage_in_usermode": 50000000,
          "total_usage": 191215355,
          "usage_in_kernelmode": 30000000
        },
        "system_cpu_usage": 999306590000000,
        "online_cpus": 4,
        "throttling_data": {
          "periods": 0,
          "throttled_periods": 0,
          "throttled_time": 0
        }
      },
      "precpu_stats": {
        "cpu_usage": {
          "percpu_usage": [
            8646879,
            24350896,
            36438778,
            30657443
          ],
          "usage_in_usermode": 50000000,
          "total_usage": 0,
          "usage_in_kernelmode": 30000000
        },
        "system_cpu_usage": 999305590000000,
        "online_cpus": 4,
        "throttling_data": {
          "periods": 0,
          "throttled_periods": 0,
          "throttled_time": 0
        }
      },

      "AppArmorProfile": "",
      "Args": [
        "-c",
        "exit 9"
      ],
      "Config": {
        "AttachStderr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [
          "/bin/sh",
          "-c",
          "exit 9"
        ],
        "Domainname": "",
        "Env": [
          "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        ],
        "Hostname": "ba033ac44011",
        "Image": "ubuntu",
        "Labels": {
          "com.example.vendor": "Acme",
          "com.example.license": "GPL",
          "com.example.version": "1.0"
        },
        "MacAddress": "",
        "NetworkDisabled": false,
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "User": "",
        "Volumes": {
          "/volumes/data": {}
        },
        "WorkingDir": "",
        "StopSignal": "SIGTERM",
        "StopTimeout": 10
      },
      "Created": "2015-01-06T15:47:31.485331387Z",
      "Driver": "devicemapper",
      "HostConfig": {
        "MaximumIOps": 0,
        "MaximumIOBps": 0,
        "BlkioWeight": 0,
        "BlkioWeightDevice": [
          {}
        ],
        "BlkioDeviceReadBps": [
          {}
        ],
        "BlkioDeviceWriteBps": [
          {}
        ],
        "BlkioDeviceReadIOps": [
          {}
        ],
        "BlkioDeviceWriteIOps": [
          {}
        ],
        "ContainerIDFile": "",
        "CpusetCpus": "",
        "CpusetMems": "",
        "CpuPercent": 0,
        "CpuShares": 0,
        "CpuPeriod": 100000,
        "CpuRealtimePeriod": 0,
        "CpuRealtimeRuntime": 0,
        "CpuQuota": 50000,
        "Devices": [],
        "IpcMode": "",
        "LxcConf": [],
        "Memory": 100000,
        "MemorySwap": 0,
        "MemoryReservation": 80000,
        "KernelMemory": 0,
        "OomKillDisable": false,
        "OomScoreAdj": 500,
        "NetworkMode": "bridge",
        "PidMode": "",
        "PortBindings": {},
        "Privileged": false,
        "ReadonlyRootfs": false,
        "PublishAllPorts": false,
        "RestartPolicy": {
          "MaximumRetryCount": 2,
          "Name": "on-failure"
        },
        "LogConfig": {
          "Type": "json-file"
        },
        "Sysctls": {
          "net.ipv4.ip_forward": "1"
        },
        "Ulimits": [
          {}
        ],
        "VolumeDriver": "",
        "ShmSize": 67108864
      },
      "HostnamePath": "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/hostname",
      "HostsPath": "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/hosts",
      "LogPath": "/var/lib/docker/containers/1eb5fabf5a03807136561b3c00adcd2992b535d624d5e18b6cdc6a6844d9767b/1eb5fabf5a03807136561b3c00adcd2992b535d624d5e18b6cdc6a6844d9767b-json.log",
      "Id": "ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39",
      "Image": "04c5d3b7b0656168630d3ba35d8889bd0e9caafcaeb3004d2bfbc47e7c5d35d2",
      "MountLabel": "",
      "Name": "/boring_euclid",
      "NetworkSettings": {
        "Bridge": "",
        "SandboxID": "",
        "HairpinMode": false,
        "LinkLocalIPv6Address": "",
        "LinkLocalIPv6PrefixLen": 0,
        "SandboxKey": "",
        "SecondaryIPAddresses": null,
        "SecondaryIPv6Addresses": null,
        "EndpointID": "",
        "Gateway": "",
        "GlobalIPv6Address": "",
        "GlobalIPv6PrefixLen": 0,
        "IPAddress": "",
        "IPPrefixLen": 0,
        "IPv6Gateway": "",
        "MacAddress": "",
        "Networks": {
          "bridge": {
            "NetworkID": "7ea29fc1412292a2d7bba362f9253545fecdfa8ce9a6e37dd10ba8bee7129812",
            "EndpointID": "7587b82f0dada3656fda26588aee72630c6fab1536d36e394b2bfbcf898c971d",
            "Gateway": "172.17.0.1",
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "MacAddress": "02:42:ac:12:00:02"
          }
        }
      },
      "Path": "/bin/sh",
      "ProcessLabel": "",
      "ResolvConfPath": "/var/lib/docker/containers/ba033ac4401106a3b513bc9d639eee123ad78ca3616b921167cd74b20e25ed39/resolv.conf",
      "RestartCount": 1,
      "State": {
        "Error": "",
        "ExitCode": 9,
        "FinishedAt": "2015-01-06T15:47:32.080254511Z",
        "OOMKilled": false,
        "Dead": false,
        "Paused": false,
        "Pid": 0,
        "Restarting": false,
        "Running": true,
        "StartedAt": "2015-01-06T15:47:32.072697474Z",
        "Status": "running"
      },
      "Mounts": [
        {
          "Name": "fac362...80535",
          "Source": "/data",
          "Destination": "/data",
          "Driver": "local",
          "Mode": "ro,Z",
          "RW": false,
          "Propagation": ""
        }
      ],
      "statistics": [{
        cpu: {
          current: 2
        },
        memory: {
          total: 100000
        }
      }, {
        cpu: {
          current: 50
        },
        memory: {
          total: 100000
        }
      }]
    };
    testObj.analyze(container).then(facts => {
      console.log(facts);
      var actual = facts.filter(el => { return el.type === 'cpu-saturated'});
      actual.length.should.be.equal(1);
      done();
    });
  });

  it('Validate memory excess rule (issue)', function(done) {
    var container = {
      "Id":"0e3c1387d3a238d44da2d7b885d8f808590c4d6c99d4c69a1e3ca015f5582a22","Created":"2017-09-21T00:22:33.901701041Z","Path":"java",
      "Args":["-jar","/maven/pcsc-resource-management.jar"],
      "State":{"Status":"running","Running":true,"Paused":false,"Restarting":false,"OOMKilled":false,"Dead":false,"Pid":7752,"ExitCode":0,"Error":"","StartedAt":"2017-09-21T00:22:34.349271116Z","FinishedAt":"0001-01-01T00:00:00Z"},
      "Image":"sha256:00a821e76600a671f5eecd13a0f8594c6b6d50fa074b52d8ca408beabd6a52f2",
      "ResolvConfPath":"/var/lib/docker/containers/0e3c1387d3a238d44da2d7b885d8f808590c4d6c99d4c69a1e3ca015f5582a22/resolv.conf",
      "HostnamePath":"/var/lib/docker/containers/0e3c1387d3a238d44da2d7b885d8f808590c4d6c99d4c69a1e3ca015f5582a22/hostname",
      "HostsPath":"/var/lib/docker/containers/0e3c1387d3a238d44da2d7b885d8f808590c4d6c99d4c69a1e3ca015f5582a22/hosts",
      "LogPath":"","Node":{"ID":"JG4P:LENV:4B3P:AWK2:R6RJ:7BU3:I2D3:S4QN:SGOH:3V5K:OKNG:ZUJ2|10.0.1.83:2376","IP":"10.0.1.83","Addr":"10.0.1.83:2376","Name":"dev-swarm-node-01","Cpus":2,"Memory":4142297088,"Labels":{"kernelversion":"4.4.0-1020-aws","operatingsystem":"Ubuntu 16.04.2 LTS","ostype":"linux","provider":"amazonec2","storagedriver":"aufs"}},
      "Name":"/zdyynjq4ywfjogiymdmwotmxztfmn2u0_pcsc-resource-management_1",
      "RestartCount":0,"Driver":"aufs","MountLabel":"","ProcessLabel":"","AppArmorProfile":"docker-default","ExecIDs":null,
      "HostConfig":{"Binds":[],"ContainerIDFile":"",
      "LogConfig":{"Type":"splunk",
      "Config":{
        "splunk-index":"index","splunk-insecureskipverify":"true",
        "splunk-token":"AAAAAA7","splunk-url":"https://splunk-company.com/","tag":"{{.Name}}"}},"NetworkMode":"apps","PortBindings":{},"RestartPolicy":{"Name":"always","MaximumRetryCount":0},"AutoRemove":false,"VolumeDriver":"","VolumesFrom":[],"CapAdd":null,"CapDrop":null,"Dns":null,"DnsOptions":null,"DnsSearch":null,"ExtraHosts":null,"GroupAdd":null,"IpcMode":"","Cgroup":"","Links":null,"OomScoreAdj":0,"PidMode":"","Privileged":false,"PublishAllPorts":false,"ReadonlyRootfs":false,"SecurityOpt":null,"UTSMode":"","UsernsMode":"","ShmSize":67108864,"Runtime":"runc","ConsoleSize":[0,0],"Isolation":"","CpuShares":0,"Memory":536870912,"NanoCpus":0,"CgroupParent":"","BlkioWeight":0,"BlkioWeightDevice":null,"BlkioDeviceReadBps":null,"BlkioDeviceWriteBps":null,"BlkioDeviceReadIOps":null,"BlkioDeviceWriteIOps":null,"CpuPeriod":100000,"CpuQuota":15000,"CpuRealtimePeriod":0,"CpuRealtimeRuntime":0,"CpusetCpus":"","CpusetMems":"","Devices":null,"DeviceCgroupRules":null,"DiskQuota":0,"KernelMemory":0,"MemoryReservation":385904640,"MemorySwap":-1,"MemorySwappiness":null,"OomKillDisable":false,"PidsLimit":0,"Ulimits":null,"CpuCount":0,"CpuPercent":0,"IOMaximumIOps":0,"IOMaximumBandwidth":0},"GraphDriver":{"Data":null,"Name":"aufs"},"Mounts":[],"Config":{"Hostname":"0e3c1387d3a2","Domainname":"","User":"","AttachStdin":false,"AttachStdout":false,"AttachStderr":false,"ExposedPorts":{"8081/tcp":{},"8083/tcp":{}},"Tty":false,"OpenStdin":false,"StdinOnce":false,"Env":["EUREKA_CLIENT_ENABLED=true","EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://10.0.1.79:8085/eureka/","SPRING_CLOUD_CONFIG_URI=http://10.0.1.79:8086","SPRING_CLOUD_CONFIG_ENABLED=true","PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/jvm/java-1.8-openjdk/jre/bin:/usr/lib/jvm/java-1.8-openjdk/bin","LANG=C.UTF-8","JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk/jre","JAVA_VERSION=8u131","JAVA_ALPINE_VERSION=8.131.11-r2"],"Cmd":null,"ArgsEscaped":true,"Image":"dockerhub.company.com/repo/pcsc-resource-management:1.5.1-SNAPSHOT-DEV","Volumes":null,"WorkingDir":"","Entrypoint":["java","-jar","/maven/pcsc-resource-management.jar"],"OnBuild":null,"Labels":{"com.docker.compose.config-hash":"7d7ec3ce1a30755424868adf4b86cc65675f89497071c5c170962e579257a177","com.docker.compose.container-number":"1","com.docker.compose.oneoff":"False","com.docker.compose.project":"zdyynjq4ywfjogiymdmwotmxztfmn2u0","com.docker.compose.service":"pcsc-resource-management","com.docker.compose.version":"1.10.0-rc2","com.docker.swarm.id":"3b1aa9426f1637a265cd3412861299f8b08b47eaef3a6c306d977cb98427387c"}},"NetworkSettings":{"Bridge":"","SandboxID":"f191a5d850c307a8b8a8e3f14fcd010ab8ad616b560911fa8b641533003d6fc4","HairpinMode":false,"LinkLocalIPv6Address":"","LinkLocalIPv6PrefixLen":0,"Ports":{"8081/tcp":null,"8083/tcp":null},"SandboxKey":"/var/run/docker/netns/f191a5d850c3","SecondaryIPAddresses":null,"SecondaryIPv6Addresses":null,"EndpointID":"","Gateway":"","GlobalIPv6Address":"","GlobalIPv6PrefixLen":0,"IPAddress":"","IPPrefixLen":0,"IPv6Gateway":"","MacAddress":"","Networks":{"apps":{"IPAMConfig":null,"Links":null,"Aliases":["0e3c1387d3a2","pcsc-resource-management"],"NetworkID":"e8d26b2010c1fa2a97bf248cd269d888b38016621581673fc1f00f504089e4df","EndpointID":"999ec6689ccf14b6a575ff5ac37d6fc91805f3ec2af46370c8db30174767badd","Gateway":"","IPAddress":"172.16.240.11","IPPrefixLen":24,"IPv6Gateway":"","GlobalIPv6Address":"","GlobalIPv6PrefixLen":0,"MacAddress":"02:42:ac:10:f0:0b","DriverOpts":null}}},"anomalies":[{"type":"cpu-throttled"},{"type":"cpu-excess"},{"type":"cpu-spike"},{"type":"memory-excess"}],"statistics":[{"timestamp":1507124423973,"cpu":{"current":0.0759459595959596,"throttling":{"periods":1239228,"throttled_periods":182345,"throttled_time":10584667754726},"allocated":15},"network":{"rx":169674811,"tx":187009241},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124424972,"cpu":{"current":0.14137141414141413,"throttling":{"periods":1239230,"throttled_periods":182345,"throttled_time":10584667754726},"allocated":15},"network":{"rx":169675010,"tx":187009747},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124426002,"cpu":{"current":0.08954954773869346,"throttling":{"periods":1239233,"throttled_periods":182345,"throttled_time":10584667754726},"allocated":15},"network":{"rx":169675281,"tx":187009937},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124426973,"cpu":{"current":0.07867626262626262,"throttling":{"periods":1239235,"throttled_periods":182345,"throttled_time":10584667754726},"allocated":15},"network":{"rx":169675281,"tx":187009937},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124428011,"cpu":{"current":0.13322051282051284,"throttling":{"periods":1239240,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169675661,"tx":187010411},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124428974,"cpu":{"current":0.07368090000000001,"throttling":{"periods":1239243,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169675661,"tx":187010411},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124429993,"cpu":{"current":0.0730040404040404,"throttling":{"periods":1239246,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169675661,"tx":187010411},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124430975,"cpu":{"current":0.0906526,"throttling":{"periods":1239247,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169675932,"tx":187010601},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124432000,"cpu":{"current":0.06772914572864322,"throttling":{"periods":1239247,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169675932,"tx":187010601},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124432992,"cpu":{"current":0.13214686868686867,"throttling":{"periods":1239252,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169676312,"tx":187011075},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124433979,"cpu":{"current":0.06476743718592964,"throttling":{"periods":1239252,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169676312,"tx":187011075},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124434979,"cpu":{"current":0.06916924623115578,"throttling":{"periods":1239255,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169676312,"tx":187011075},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124435979,"cpu":{"current":0.08349373737373737,"throttling":{"periods":1239260,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169676583,"tx":187011265},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124436979,"cpu":{"current":0.0659956345177665,"throttling":{"periods":1239260,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169676583,"tx":187011265},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124437978,"cpu":{"current":0.13104562814070353,"throttling":{"periods":1239265,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169676963,"tx":187011739},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124438990,"cpu":{"current":0.06676100502512564,"throttling":{"periods":1239268,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169676963,"tx":187011739},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124439994,"cpu":{"current":0.06806666666666666,"throttling":{"periods":1239270,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169676963,"tx":187011739},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124440975,"cpu":{"current":0.07822100502512562,"throttling":{"periods":1239272,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169677234,"tx":187011929},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124441981,"cpu":{"current":0.0658788,"throttling":{"periods":1239276,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169677234,"tx":187011929},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124442983,"cpu":{"current":0.12469299492385787,"throttling":{"periods":1239278,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169677614,"tx":187012403},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124443983,"cpu":{"current":0.0675839,"throttling":{"periods":1239280,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169677614,"tx":187012403},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124444979,"cpu":{"current":0.06875683673469388,"throttling":{"periods":1239285,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169677614,"tx":187012403},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124445994,"cpu":{"current":0.08580251256281407,"throttling":{"periods":1239289,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169677885,"tx":187012593},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124446982,"cpu":{"current":0.06907575757575758,"throttling":{"periods":1239293,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169677885,"tx":187012593},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124447989,"cpu":{"current":0.12855616161616162,"throttling":{"periods":1239295,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169678307,"tx":187013109},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124448984,"cpu":{"current":0.06027638190954774,"throttling":{"periods":1239299,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169678307,"tx":187013109},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124449985,"cpu":{"current":0.06409147208121828,"throttling":{"periods":1239299,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169678307,"tx":187013109},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124450987,"cpu":{"current":0.08057747474747474,"throttling":{"periods":1239302,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169678578,"tx":187013299},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124451985,"cpu":{"current":0.06708161616161616,"throttling":{"periods":1239306,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169678578,"tx":187013299},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124452986,"cpu":{"current":0.14345125628140704,"throttling":{"periods":1239309,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169679164,"tx":187014045},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124453986,"cpu":{"current":0.06040243654822335,"throttling":{"periods":1239309,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169679164,"tx":187014045},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124454998,"cpu":{"current":0.15208700507614212,"throttling":{"periods":1239314,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169679363,"tx":187014551},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124456005,"cpu":{"current":0.08334904522613065,"throttling":{"periods":1239315,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169679634,"tx":187014741},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124456986,"cpu":{"current":0.06576150753768843,"throttling":{"periods":1239315,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169679634,"tx":187014741},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124457998,"cpu":{"current":0.12194707070707071,"throttling":{"periods":1239320,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680014,"tx":187015215},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124458990,"cpu":{"current":0.06686828282828283,"throttling":{"periods":1239323,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680014,"tx":187015215},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124460019,"cpu":{"current":0.07294111111111111,"throttling":{"periods":1239327,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680014,"tx":187015215},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124460999,"cpu":{"current":0.0910235175879397,"throttling":{"periods":1239329,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680285,"tx":187015405},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124461991,"cpu":{"current":0.07255050505050506,"throttling":{"periods":1239329,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680285,"tx":187015405},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124463012,"cpu":{"current":0.12701686868686868,"throttling":{"periods":1239334,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680665,"tx":187015879},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124463991,"cpu":{"current":0.0674098,"throttling":{"periods":1239336,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680665,"tx":187015879},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124465001,"cpu":{"current":0.061205177664974623,"throttling":{"periods":1239340,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680665,"tx":187015879},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124465991,"cpu":{"current":0.08775828282828282,"throttling":{"periods":1239341,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680936,"tx":187016069},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124467009,"cpu":{"current":0.07342150753768845,"throttling":{"periods":1239346,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169680936,"tx":187016069},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124468000,"cpu":{"current":0.1280892857142857,"throttling":{"periods":1239347,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169681316,"tx":187016543},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124468993,"cpu":{"current":0.065638391959799,"throttling":{"periods":1239348,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169681316,"tx":187016543},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124470011,"cpu":{"current":0.07131969849246231,"throttling":{"periods":1239352,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169681316,"tx":187016543},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124470990,"cpu":{"current":0.08959035532994923,"throttling":{"periods":1239352,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169681587,"tx":187016733},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124472011,"cpu":{"current":0.07338060301507537,"throttling":{"periods":1239355,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169681587,"tx":187016733},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124472996,"cpu":{"current":0.12286000000000001,"throttling":{"periods":1239357,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169681967,"tx":187017207},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124474013,"cpu":{"current":0.06376761421319797,"throttling":{"periods":1239357,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169681967,"tx":187017207},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124475005,"cpu":{"current":0.0700324,"throttling":{"periods":1239359,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169681967,"tx":187017207},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124476000,"cpu":{"current":0.09837829145728644,"throttling":{"periods":1239361,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169682238,"tx":187017397},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124476999,"cpu":{"current":0.0711279797979798,"throttling":{"periods":1239365,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169682238,"tx":187017397},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124478013,"cpu":{"current":0.1257413,"throttling":{"periods":1239369,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169682618,"tx":187017871},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124478997,"cpu":{"current":0.06524081218274111,"throttling":{"periods":1239371,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169682618,"tx":187017871},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124479998,"cpu":{"current":0.06423767676767678,"throttling":{"periods":1239374,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169682618,"tx":187017871},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124481000,"cpu":{"current":0.08145343434343434,"throttling":{"periods":1239377,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169682889,"tx":187018061},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124481999,"cpu":{"current":0.0733139393939394,"throttling":{"periods":1239377,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169682889,"tx":187018061},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124483007,"cpu":{"current":0.14022730964467006,"throttling":{"periods":1239380,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169683475,"tx":187018807},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124484005,"cpu":{"current":0.06335009999999999,"throttling":{"periods":1239382,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169683475,"tx":187018807},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124485003,"cpu":{"current":0.1558790909090909,"throttling":{"periods":1239384,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169683674,"tx":187019313},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124485996,"cpu":{"current":0.10345276381909549,"throttling":{"periods":1239386,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169683945,"tx":187019503},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124487007,"cpu":{"current":0.08344414141414142,"throttling":{"periods":1239391,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169683945,"tx":187019503},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124488019,"cpu":{"current":0.12362832487309645,"throttling":{"periods":1239394,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169684325,"tx":187019977},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124489008,"cpu":{"current":0.06829111111111111,"throttling":{"periods":1239396,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169684325,"tx":187019977},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124490004,"cpu":{"current":0.06600929292929293,"throttling":{"periods":1239396,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169684325,"tx":187019977},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124491005,"cpu":{"current":0.08465367346938775,"throttling":{"periods":1239401,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169684596,"tx":187020167},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124492006,"cpu":{"current":0.06934888888888889,"throttling":{"periods":1239405,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169684596,"tx":187020167},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124493007,"cpu":{"current":0.1277857,"throttling":{"periods":1239405,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169684976,"tx":187020641},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124494039,"cpu":{"current":0.06640887755102041,"throttling":{"periods":1239408,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169684976,"tx":187020641},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124495016,"cpu":{"current":0.06713542288557213,"throttling":{"periods":1239408,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169684976,"tx":187020641},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124496012,"cpu":{"current":0.08407434343434343,"throttling":{"periods":1239408,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169685247,"tx":187020831},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124497006,"cpu":{"current":0.06220020100502513,"throttling":{"periods":1239412,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169685247,"tx":187020831},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124498018,"cpu":{"current":0.12473797979797979,"throttling":{"periods":1239414,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169685669,"tx":187021347},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124499015,"cpu":{"current":0.06364363636363636,"throttling":{"periods":1239414,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169685669,"tx":187021347},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124500007,"cpu":{"current":0.06903492385786802,"throttling":{"periods":1239416,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169685669,"tx":187021347},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124501005,"cpu":{"current":0.0885053807106599,"throttling":{"periods":1239420,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169685940,"tx":187021537},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124502005,"cpu":{"current":0.07892030303030304,"throttling":{"periods":1239420,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169685940,"tx":187021537},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124503007,"cpu":{"current":0.12805343434343436,"throttling":{"periods":1239424,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169686320,"tx":187022011},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124504020,"cpu":{"current":0.06958616161616162,"throttling":{"periods":1239428,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169686320,"tx":187022011},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124505018,"cpu":{"current":0.06128974874371859,"throttling":{"periods":1239428,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169686320,"tx":187022011},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124506025,"cpu":{"current":0.08890532663316583,"throttling":{"periods":1239430,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169686591,"tx":187022201},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124507033,"cpu":{"current":0.07331908629441625,"throttling":{"periods":1239430,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169686591,"tx":187022201},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124508011,"cpu":{"current":0.12490878787878787,"throttling":{"periods":1239434,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169686971,"tx":187022675},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124509029,"cpu":{"current":0.07136548223350253,"throttling":{"periods":1239438,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169686971,"tx":187022675},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124510024,"cpu":{"current":0.0663156783919598,"throttling":{"periods":1239438,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169686971,"tx":187022675},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124511015,"cpu":{"current":0.08758213197969544,"throttling":{"periods":1239440,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169687242,"tx":187022865},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124512027,"cpu":{"current":0.06801828282828283,"throttling":{"periods":1239442,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169687242,"tx":187022865},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124513027,"cpu":{"current":0.14171979899497486,"throttling":{"periods":1239446,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169687828,"tx":187023611},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124514014,"cpu":{"current":0.07316939393939394,"throttling":{"periods":1239446,"throttled_periods":182346,"throttled_time":10584725212971},"allocated":15},"network":{"rx":169687828,"tx":187023611},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124515015,"cpu":{"current":0.16535634517766498,"throttling":{"periods":1239451,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169688027,"tx":187024117},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124516020,"cpu":{"current":0.08710636363636363,"throttling":{"periods":1239457,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169688298,"tx":187024307},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124517019,"cpu":{"current":0.0738039,"throttling":{"periods":1239461,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169688298,"tx":187024307},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124518016,"cpu":{"current":0.16062141414141415,"throttling":{"periods":1239463,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169688678,"tx":187024781},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124519016,"cpu":{"current":0.07572434343434344,"throttling":{"periods":1239467,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169688678,"tx":187024781},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124520021,"cpu":{"current":0.07239698492462311,"throttling":{"periods":1239467,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169688678,"tx":187024781},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124521018,"cpu":{"current":0.09112071065989848,"throttling":{"periods":1239471,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169688949,"tx":187024971},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124522036,"cpu":{"current":0.07743826530612244,"throttling":{"periods":1239475,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169688949,"tx":187024971},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124523018,"cpu":{"current":0.12412777777777778,"throttling":{"periods":1239477,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169689329,"tx":187025445},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124524025,"cpu":{"current":0.07580562814070352,"throttling":{"periods":1239482,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169689329,"tx":187025445},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124525021,"cpu":{"current":0.07158700507614213,"throttling":{"periods":1239482,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169689329,"tx":187025445},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124526018,"cpu":{"current":0.08327145728643216,"throttling":{"periods":1239486,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169689600,"tx":187025635},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124527027,"cpu":{"current":0.063732,"throttling":{"periods":1239488,"throttled_periods":182347,"throttled_time":10584813059819},"allocated":15},"network":{"rx":169689600,"tx":187025635},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124528021,"cpu":{"current":0.12921888324873096,"throttling":{"periods":1239495,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},"network":{"rx":169689980,"tx":187026109},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124529023,"cpu":{"current":0.06324338308457711,"throttling":{"periods":1239498,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},"network":{"rx":169689980,"tx":187026109},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124530027,"cpu":{"current":0.06332171717171717,"throttling":{"periods":1239500,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},"network":{"rx":169689980,"tx":187026109},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124531026,"cpu":{"current":0.08555269035532995,"throttling":{"periods":1239506,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},"network":{"rx":169690251,"tx":187026299},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124532022,"cpu":{"current":0.07487030303030304,"throttling":{"periods":1239510,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},"network":{"rx":169690251,"tx":187026299},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124533023,"cpu":{"current":0.1239379797979798,"throttling":{"periods":1239514,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},"network":{"rx":169690631,"tx":187026773},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124534023,"cpu":{"current":0.06018162436548224,"throttling":{"periods":1239516,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},"network":{"rx":169690631,"tx":187026773},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124535026,"cpu":{"current":0.06215545454545454,"throttling":{"periods":1239520,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},"network":{"rx":169690631,"tx":187026773},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},{"timestamp":1507124536063,"cpu":{"current":0.09030653266331658,"throttling":{"periods":1239525,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},"network":{"rx":169690902,"tx":187026963},"blkio":{"blkRead":0,"blkWrite":0},"memory":{"current":350822400,"max":617259008,"total":536870912}},
          {
            "timestamp":1507124537020,
            "cpu":{"current":0.06488535353535355,"throttling":{"periods":1239527,"throttled_periods":182348,"throttled_time":10584826341973},"allocated":15},
            "network":{"rx":169690902,"tx":187026963},
            "blkio":{"blkRead":0,"blkWrite":0},
            "memory":{"current":350822400,"max":617259008,"total":536870912}
          }
        ],"networks":{"eth0":{"rx_bytes":63463198,"rx_packets":234218,"rx_errors":0,"rx_dropped":0,"tx_bytes":44491533,"tx_packets":468333,"tx_errors":0,"tx_dropped":0},"eth1":{"rx_bytes":106211613,"rx_packets":656587,"rx_errors":0,"rx_dropped":0,"tx_bytes":142517708,"tx_packets":967550,"tx_errors":0,"tx_dropped":0}},
        "id":"0e3c1387d3a238d44da2d7b885d8f808590c4d6c99d4c69a1e3ca015f5582a22","name":"/zdyynjq4ywfjogiymdmwotmxztfmn2u0_pcsc-resource-management_1","memory_stats":{"usage":350822400,"max_usage":617259008,"stats":{"active_anon":349696000,"active_file":1089536,"cache":1138688,"dirty":8192,"hierarchical_memory_limit":536870912,"inactive_anon":4096,"inactive_file":32768,"mapped_file":32768,"pgfault":701040,"pgmajfault":4,"pgpgin":371814,"pgpgout":646930,"rss":349683712,"rss_huge":293601280,"total_active_anon":349696000,"total_active_file":1089536,"total_cache":1138688,"total_dirty":8192,"total_inactive_anon":4096,"total_inactive_file":32768,"total_mapped_file":32768,"total_pgfault":701040,"total_pgmajfault":4,"total_pgpgin":371814,"total_pgpgout":646930,"total_rss":349683712,"total_rss_huge":293601280,"total_unevictable":0,"total_writeback":0,"unevictable":0,"writeback":0},"limit":536870912},"precpu_stats":{"cpu_usage":{"total_usage":1026402600539,"percpu_usage":[513694305694,512708294845],"usage_in_kernelmode":49040000000,"usage_in_usermode":77980000000},"system_cpu_usage":2599207570000000,"online_cpus":2,"throttling_data":{"periods":1239224,"throttled_periods":182345,"throttled_time":10584667754726}},"cpu_stats":{"cpu_usage":{"total_usage":1026403352404,"percpu_usage":[513694386286,512708966118],"usage_in_kernelmode":49040000000,"usage_in_usermode":77980000000},"system_cpu_usage":2599209550000000,"online_cpus":2,"throttling_data":{"periods":1239228,"throttled_periods":182345,"throttled_time":10584667754726}},"storage_stats":{},"num_procs":0,"blkio_stats":{"io_service_bytes_recursive":[{"major":202,"minor":0,"op":"Read","value":1056768},{"major":202,"minor":0,"op":"Write","value":0},{"major":202,"minor":0,"op":"Sync","value":0},{"major":202,"minor":0,"op":"Async","value":1056768},{"major":202,"minor":0,"op":"Total","value":1056768}],"io_serviced_recursive":[{"major":202,"minor":0,"op":"Read","value":16},{"major":202,"minor":0,"op":"Write","value":0},{"major":202,"minor":0,"op":"Sync","value":0},{"major":202,"minor":0,"op":"Async","value":16},{"major":202,"minor":0,"op":"Total","value":16}],"io_queue_recursive":[],"io_service_time_recursive":[],"io_wait_time_recursive":[],"io_merged_recursive":[],"io_time_recursive":[],"sectors_recursive":[]},"pids_stats":{"current":35},"preread":"2017-10-04T13:40:23.88129088Z","read":"2017-10-04T13:40:24.881269939Z","success-events":{"id":"success-events","priority":1,"options":{"cache":false}}};

    testObj.analyze(container).then(facts => {
      console.log(facts);
      var actual = facts.filter(el => { return el.type === 'cpu-throttled'});
      actual.length.should.be.equal(1);
      var actual = facts.filter(el => { return el.type === 'memory-excess'});
      actual.length.should.be.equal(0);
      done();
    });
  });
});
