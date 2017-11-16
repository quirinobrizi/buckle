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
        let expected = [{
                name: 'dbpostgres',
                configuration: {
                    Cmd: undefined,
                    Entrypoint: undefined,
                    Env: ['VAR_1=10'],
                    ExposedPorts: undefined,
                    Image: 'postgres:9.3.1',
                    Labels: {},
                    StopSignal: undefined,
                    HostConfig: {
                        CpuShares: undefined,
                        Memory: undefined,
                        BlkioWeight: undefined,
                        BlkioWeightDevice: undefined,
                        CpuPeriod: undefined,
                        CpuQuota: undefined,
                        CpuRealtimePeriod: undefined,
                        CpuRealtimeRuntime: undefined,
                        CpusetCpus: undefined,
                        CpusetMems: undefined,
                        Devices: ['/dev/ttyUSB0:/dev/ttyUSB0'],
                        DeviceCgroupRules: undefined,
                        DiskQuota: undefined,
                        CgroupParent: undefined,
                        CapAdd: undefined,
                        CapDrop: undefined,
                        Dns: [undefined],
                        DnsSearch: [undefined],
                        ExtraHosts: undefined,
                        Links: undefined,
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
                        SecurityOpt: undefined,
                        Ulimits: undefined,
                        CpuCount: undefined
                    }
                }
            },
            {
                name: 'express-app-container',
                configuration: {
                    Cmd: undefined,
                    Entrypoint: undefined,
                    Env: ['VAR_1=ABCD'],
                    ExposedPorts: undefined,
                    Image: 'myimage:3.0.1',
                    Labels: {},
                    StopSignal: undefined,
                    HostConfig: {
                        CpuShares: undefined,
                        Memory: undefined,
                        BlkioWeight: undefined,
                        BlkioWeightDevice: undefined,
                        CpuPeriod: undefined,
                        CpuQuota: undefined,
                        CpuRealtimePeriod: undefined,
                        CpuRealtimeRuntime: undefined,
                        CpusetCpus: undefined,
                        CpusetMems: undefined,
                        Devices: undefined,
                        DeviceCgroupRules: undefined,
                        DiskQuota: undefined,
                        CgroupParent: undefined,
                        CapAdd: undefined,
                        CapDrop: undefined,
                        Dns: [undefined],
                        DnsSearch: [undefined],
                        ExtraHosts: undefined,
                        Links: ['dbpostgres'],
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
                        SecurityOpt: undefined,
                        Ulimits: undefined,
                        CpuCount: undefined
                    }
                }
            }
        ];
        assert.deepEqual(actual, expected);
    });
});
