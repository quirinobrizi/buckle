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

const ComposeAdaptorV1 = require('../../src/adaptor/ComposeAdaptorV1');

describe("ComposeAdaptorV1", function () {

    it("adapt configuration received", function () {
        let testObj = new ComposeAdaptorV1();
        let configuration = yaml.safeLoad(fs.readFileSync('./test/resources/docker-compose-v1.yml', 'utf8'));
        // act
        let actual = testObj.adapt(configuration);
        // assert
        // console.log(util.inspect(actual, {
        //     colors: true,
        //     depth: 10
        // }));
        let expected = {
            containers: {
                dbpostgres: {
                    name: 'dbpostgres',
                    "cardinality": 1,
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
                        Env: ['VAR_1=10'],
                        Cmd: undefined,
                        Healthcheck: undefined,
                        ArgsEscaped: undefined,
                        Image: 'postgres:9.3.1',
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
                            BlkioWeight: undefined,
                            BlkioWeightDevice: undefined,
                            BlkioDeviceReadBps: undefined,
                            BlkioDeviceWriteBps: undefined,
                            BlkioDeviceReadIOps: undefined,
                            BlkioDeviceWriteIOps: undefined,
                            CpuPeriod: undefined,
                            CpuQuota: undefined,
                            CpuRealtimePeriod: undefined,
                            CpuRealtimeRuntime: undefined,
                            CpusetCpus: undefined,
                            CpusetMems: undefined,
                            Devices: ['/dev/ttyUSB0:/dev/ttyUSB0'],
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
                            PortBindings: {
                                '5304/tcp': [{
                                    HostPort: '5304'
                                }]
                            },
                            RestartPolicy: {
                                name: undefined
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
                            Tmpfs: undefined,
                            UTSMode: undefined,
                            UsernsMode: undefined,
                            ShmSize: undefined,
                            Sysctls: undefined,
                            Runtime: undefined,
                            ConsoleSize: undefined,
                            Isolation: undefined
                        },
                        NetworkingConfig: undefined
                    }
                },
                'express-app-container': {
                    name: 'express-app-container',
                    "cardinality": 1,
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
                        Env: ['VAR_1=ABCD'],
                        Cmd: undefined,
                        Healthcheck: undefined,
                        ArgsEscaped: undefined,
                        Image: 'myimage:3.0.1',
                        Volumes: {
                            '/app': {}
                        },
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
                            BlkioWeight: undefined,
                            BlkioWeightDevice: undefined,
                            BlkioDeviceReadBps: undefined,
                            BlkioDeviceWriteBps: undefined,
                            BlkioDeviceReadIOps: undefined,
                            BlkioDeviceWriteIOps: undefined,
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
                            Binds: ['./:/app'],
                            ContainerIDFile: undefined,
                            LogConfig: {
                                Type: undefined,
                                Config: undefined
                            },
                            NetworkMode: undefined,
                            PortBindings: {
                                '3000/tcp': [{
                                    HostPort: '3000'
                                }]
                            },
                            RestartPolicy: {
                                name: undefined
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
                            Links: ['dbpostgres'],
                            OomScoreAdj: undefined,
                            PidMode: undefined,
                            Privileged: undefined,
                            PublishAllPorts: undefined,
                            ReadonlyRootfs: undefined,
                            SecurityOpt: undefined,
                            StorageOpt: undefined,
                            Tmpfs: undefined,
                            UTSMode: undefined,
                            UsernsMode: undefined,
                            ShmSize: undefined,
                            Sysctls: undefined,
                            Runtime: undefined,
                            ConsoleSize: undefined,
                            Isolation: undefined
                        },
                        NetworkingConfig: undefined
                    }
                }
            },
            networks: {},
            volumes: {}
        };
        assert.deepEqual(actual, expected);
    });
});
