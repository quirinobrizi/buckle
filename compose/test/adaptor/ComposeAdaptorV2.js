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

const fs = require('fs');
const util = require('util');
const yaml = require('js-yaml');
const assert = require('assert');

const ComposeAdaptorV2 = require('../../src/adaptor/ComposeAdaptorV2');

describe("ComposeAdaptorV2", function() {

    it("adapt configuration received", function() {
        let testObj = new ComposeAdaptorV2();
        let configuration = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v2.yml', 'utf8'));
        // act
        let actual = testObj.adapt(configuration);
        // assert
        // console.log(util.inspect(actual, {
        //     colors: true,
        //     depth: 10
        // }));
        let expected = {
            containers: {
                foo: {
                    name: 'foo',
                    cardinality: 1,
                    configuration: {
                        Hostname: undefined,
                        Domainname: undefined,
                        User: undefined,
                        AttachStdin: false,
                        AttachStdout: true,
                        AttachStderr: true,
                        ExposedPorts: undefined,
                        Tty: false,
                        OpenStdin: false,
                        StdinOnce: undefined,
                        Env: undefined,
                        Cmd: undefined,
                        Healthcheck: null,
                        ArgsEscaped: undefined,
                        Image: 'busybox',
                        Volumes: undefined,
                        WorkingDir: undefined,
                        Entrypoint: undefined,
                        NetworkDisabled: undefined,
                        MacAddress: undefined,
                        OnBuild: [],
                        Labels: undefined,
                        StopSignal: undefined,
                        StopTimeout: 10,
                        Shell: undefined,
                        HostConfig: {
                            CpuShares: undefined,
                            Memory: undefined,
                            CgroupParent: undefined,
                            BlkioWeight: 300,
                            BlkioWeightDevice: [{
                                Path: '/dev/sda',
                                Weight: 400
                            }],
                            BlkioDeviceReadBps: [{
                                Path: '/dev/sdb',
                                Rate: '12mb'
                            }],
                            BlkioDeviceWriteBps: [{
                                Path: '/dev/sdb',
                                Rate: '1024k'
                            }],
                            BlkioDeviceReadIOps: [{
                                Path: '/dev/sdb',
                                Rate: 120
                            }],
                            BlkioDeviceWriteIOps: [{
                                Path: '/dev/sdb',
                                Rate: 30
                            }],
                            CpuPeriod: undefined,
                            CpuQuota: undefined,
                            CpuRealtimePeriod: undefined,
                            CpuRealtimeRuntime: undefined,
                            CpusetCpus: undefined,
                            CpusetMems: undefined,
                            Devices: undefined,
                            DeviceCgroupRules: undefined,
                            DiskQuota: undefined,
                            KernelMemory: undefined,
                            MemoryReservation: undefined,
                            MemorySwap: undefined,
                            MemorySwappiness: undefined,
                            NanoCPUs: undefined,
                            OomKillDisable: undefined,
                            PidsLimit: undefined,
                            Ulimits: undefined,
                            CpuCount: undefined,
                            CpuPercent: undefined,
                            IOMaximumIOps: undefined,
                            IOMaximumBandwidth: undefined,
                            Binds: undefined,
                            ContainerIDFile: undefined,
                            LogConfig: {
                                Type: undefined,
                                Config: undefined
                            },
                            NetworkMode: undefined,
                            PortBindings: undefined,
                            RestartPolicy: undefined,
                            AutoRemove: undefined,
                            VolumeDriver: undefined,
                            VolumesFrom: undefined,
                            Mounts: undefined,
                            CapAdd: undefined,
                            CapDrop: undefined,
                            Dns: [undefined],
                            DnsOptions: undefined,
                            DnsSearch: [undefined],
                            ExtraHosts: undefined,
                            GroupAdd: undefined,
                            IpcMode: undefined,
                            Cgroup: undefined,
                            Links: undefined,
                            OomScoreAdj: undefined,
                            PidMode: undefined,
                            Privileged: undefined,
                            PublishAllPorts: undefined,
                            ReadonlyRootfs: undefined,
                            SecurityOpt: undefined,
                            StorageOpt: undefined,
                            Tmpfs: null,
                            UTSMode: undefined,
                            UsernsMode: undefined,
                            ShmSize: undefined,
                            Sysctls: undefined,
                            Runtime: undefined,
                            ConsoleSize: undefined,
                            Isolation: undefined
                        },
                        NetworkingConfig: {
                            EndpointsConfig: {}
                        }
                    }
                },
                microservice_1: {
                    name: 'microservice_1',
                    cardinality: 1,
                    configuration: {
                        Hostname: undefined,
                        Domainname: undefined,
                        User: undefined,
                        AttachStdin: false,
                        AttachStdout: true,
                        AttachStderr: true,
                        ExposedPorts: ['8080/tcp'],
                        Tty: false,
                        OpenStdin: false,
                        StdinOnce: undefined,
                        Env: ['SPRING_CLOUD_CONFIG_ENABLED=true',
                            'EUREKA_CLIENT_ENABLED=true'
                        ],
                        Cmd: undefined,
                        Healthcheck: null,
                        ArgsEscaped: undefined,
                        Image: undefined,
                        Volumes: undefined,
                        WorkingDir: undefined,
                        Entrypoint: undefined,
                        NetworkDisabled: undefined,
                        MacAddress: undefined,
                        OnBuild: [],
                        Labels: {
                            'org.buckle.cluster': 'microservice'
                        },
                        StopSignal: undefined,
                        StopTimeout: 10,
                        Shell: undefined,
                        HostConfig: {
                            CpuShares: undefined,
                            Memory: undefined,
                            CgroupParent: undefined,
                            BlkioWeight: null,
                            BlkioWeightDevice: null,
                            BlkioDeviceReadBps: null,
                            BlkioDeviceWriteBps: null,
                            BlkioDeviceReadIOps: null,
                            BlkioDeviceWriteIOps: null,
                            CpuPeriod: undefined,
                            CpuQuota: undefined,
                            CpuRealtimePeriod: undefined,
                            CpuRealtimeRuntime: undefined,
                            CpusetCpus: undefined,
                            CpusetMems: undefined,
                            Devices: undefined,
                            DeviceCgroupRules: undefined,
                            DiskQuota: undefined,
                            KernelMemory: undefined,
                            MemoryReservation: undefined,
                            MemorySwap: undefined,
                            MemorySwappiness: undefined,
                            NanoCPUs: undefined,
                            OomKillDisable: undefined,
                            PidsLimit: undefined,
                            Ulimits: undefined,
                            CpuCount: undefined,
                            CpuPercent: undefined,
                            IOMaximumIOps: undefined,
                            IOMaximumBandwidth: undefined,
                            Binds: undefined,
                            ContainerIDFile: undefined,
                            LogConfig: {
                                Type: undefined,
                                Config: undefined
                            },
                            NetworkMode: undefined,
                            PortBindings: undefined,
                            RestartPolicy: {
                                Name: 'always',
                                MaximumRetryCount: undefined
                            },
                            AutoRemove: undefined,
                            VolumeDriver: undefined,
                            VolumesFrom: undefined,
                            Mounts: undefined,
                            CapAdd: undefined,
                            CapDrop: undefined,
                            Dns: [undefined],
                            DnsOptions: undefined,
                            DnsSearch: [undefined],
                            ExtraHosts: undefined,
                            GroupAdd: undefined,
                            IpcMode: undefined,
                            Cgroup: undefined,
                            Links: undefined,
                            OomScoreAdj: undefined,
                            PidMode: undefined,
                            Privileged: undefined,
                            PublishAllPorts: undefined,
                            ReadonlyRootfs: undefined,
                            SecurityOpt: undefined,
                            StorageOpt: undefined,
                            Tmpfs: null,
                            UTSMode: undefined,
                            UsernsMode: undefined,
                            ShmSize: undefined,
                            Sysctls: undefined,
                            Runtime: undefined,
                            ConsoleSize: undefined,
                            Isolation: undefined
                        },
                        NetworkingConfig: {
                            EndpointsConfig: {
                                backend: {},
                                frontend: {
                                    Aliases: ['ms1'],
                                    IPAMConfig: {
                                        IPv4Address: undefined,
                                        IPv6Address: undefined,
                                        LinkLocalIPs: undefined
                                    }
                                }
                            }
                        }
                    }
                }
            },
            networks: {
                frontend: {
                    external: true
                },
                backend: {
                    external: true
                }
            },
            volumes: {
                data: {
                    external: true,
                    name: 'my-app-data'
                }
            },
            dependencies: [{
                    name: 'foo',
                    order: {
                        "microservice_1": {}
                    }
                },
                {
                    name: 'microservice_1',
                    order: undefined
                }
            ]
        };
        assert.deepEqual(actual, expected);
    });
});
