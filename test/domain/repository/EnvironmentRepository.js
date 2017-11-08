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

const td = require('testdouble');
const assert = require('assert');

const EnvironmentRepository = require('../../../src/domain/repository/EnvironmentRepository');

describe('EnvironmentRepository', function () {

    var testObj, containerRepository, container1,
        container2, dockerEngineClient, node1, node2;

    var tasks = [{
            "ID": "0kzzo1i0y4jz6027t0k7aezc7",
            "Version": {
                "Index": 71
            },
            "CreatedAt": "2016-06-07T21:07:31.171892745Z",
            "UpdatedAt": "2016-06-07T21:07:31.376370513Z",
            "Spec": {
                "ContainerSpec": {
                    "Image": "redis"
                },
                "Resources": {
                    "Limits": {},
                    "Reservations": {}
                },
                "RestartPolicy": {
                    "Condition": "any",
                    "MaxAttempts": 0
                },
                "Placement": {}
            },
            "ServiceID": "9mnpnzenvg8p8tdbtq4wvbkcz",
            "Slot": 1,
            "NodeID": "1",
            "Status": {
                "Timestamp": "2016-06-07T21:07:31.290032978Z",
                "State": "running",
                "Message": "started",
                "ContainerStatus": {
                    "ContainerID": "cnt-1",
                    "PID": 677
                }
            },
            "DesiredState": "running",
            "NetworksAttachments": [{
                "Network": {
                    "ID": "4qvuz4ko70xaltuqbt8956gd1",
                    "Version": {
                        "Index": 18
                    },
                    "CreatedAt": "2016-06-07T20:31:11.912919752Z",
                    "UpdatedAt": "2016-06-07T21:07:29.955277358Z",
                    "Spec": {
                        "Name": "ingress",
                        "Labels": {
                            "com.docker.swarm.internal": "true"
                        },
                        "DriverConfiguration": {},
                        "IPAMOptions": {
                            "Driver": {},
                            "Configs": [{
                                "Subnet": "10.255.0.0/16",
                                "Gateway": "10.255.0.1"
                            }]
                        }
                    },
                    "DriverState": {
                        "Name": "overlay",
                        "Options": {
                            "com.docker.network.driver.overlay.vxlanid_list": "256"
                        }
                    },
                    "IPAMOptions": {
                        "Driver": {
                            "Name": "default"
                        },
                        "Configs": [{
                            "Subnet": "10.255.0.0/16",
                            "Gateway": "10.255.0.1"
                        }]
                    }
                },
                "Addresses": [
                    "10.255.0.10/16"
                ]
            }]
        },
        {
            "ID": "1yljwbmlr8er2waf8orvqpwms",
            "Version": {
                "Index": 30
            },
            "CreatedAt": "2016-06-07T21:07:30.019104782Z",
            "UpdatedAt": "2016-06-07T21:07:30.231958098Z",
            "Name": "hopeful_cori",
            "Spec": {
                "ContainerSpec": {
                    "Image": "redis"
                },
                "Resources": {
                    "Limits": {},
                    "Reservations": {}
                },
                "RestartPolicy": {
                    "Condition": "any",
                    "MaxAttempts": 0
                },
                "Placement": {}
            },
            "ServiceID": "9mnpnzenvg8p8tdbtq4wvbkcz",
            "Slot": 1,
            "NodeID": "2",
            "Status": {
                "Timestamp": "2016-06-07T21:07:30.202183143Z",
                "State": "shutdown",
                "Message": "shutdown",
                "ContainerStatus": {
                    "ContainerID": "cnt-2"
                }
            },
            "DesiredState": "shutdown",
            "NetworksAttachments": [{
                "Network": {
                    "ID": "4qvuz4ko70xaltuqbt8956gd1",
                    "Version": {
                        "Index": 18
                    },
                    "CreatedAt": "2016-06-07T20:31:11.912919752Z",
                    "UpdatedAt": "2016-06-07T21:07:29.955277358Z",
                    "Spec": {
                        "Name": "ingress",
                        "Labels": {
                            "com.docker.swarm.internal": "true"
                        },
                        "DriverConfiguration": {},
                        "IPAMOptions": {
                            "Driver": {},
                            "Configs": [{
                                "Subnet": "10.255.0.0/16",
                                "Gateway": "10.255.0.1"
                            }]
                        }
                    },
                    "DriverState": {
                        "Name": "overlay",
                        "Options": {
                            "com.docker.network.driver.overlay.vxlanid_list": "256"
                        }
                    },
                    "IPAMOptions": {
                        "Driver": {
                            "Name": "default"
                        },
                        "Configs": [{
                            "Subnet": "10.255.0.0/16",
                            "Gateway": "10.255.0.1"
                        }]
                    }
                },
                "Addresses": [
                    "10.255.0.5/16"
                ]
            }]
        }
    ];

    before(function () {
        var dec = {
            getSwarm: function () {},
            listTasks: function () {},
            inspectNode: function () {}
        };
        var repo = {
            getName: function () {},
            getAll: function () {},
            getContainer: function (id) {}
        };
        var c = {
            getContainerId: function () {},
            getName: function () {},
            isDeployedOnNode: function (node) {},
            getNode: function () {}
        };
        let n = {
            getId: function () {}
        };

        container1 = td.object(c);
        container2 = td.object(c);
        td.when(container1.getContainerId()).thenReturn("a");
        td.when(container2.getContainerId()).thenReturn("b");

        node1 = td.object(n);
        node2 = td.object(n);

        td.when(container1.getNode()).thenReturn(node1);
        td.when(container2.getNode()).thenReturn(node2);

        dockerEngineClient = td.object(dec);
        containerRepository = td.object(repo);
        testObj = new EnvironmentRepository(dockerEngineClient, containerRepository);
    })

    it('retrieves containers swarm-agent', async function () {
        let containers = [container1, container2];

        td.when(dockerEngineClient.getSwarm()).thenReturn({
            Name: "name",
            ServerVersion: "1.2.8",
        });
        td.when(dockerEngineClient.listTasks()).thenThrow(new Error('Not Found'));
        td.when(containerRepository.getAll()).thenReturn(containers);
        td.when(node1.getId()).thenReturn('1');
        td.when(node2.getId()).thenReturn('2');
        td.when(dockerEngineClient.inspectNode('1')).thenReturn({
            "ID": "1",
            "IP": "10.0.1.83",
            "Addr": "10.0.1.83:2376",
            "Name": "dev-swarm-node-01",
            "Cpus": 2,
            "Memory": 4142297088,
            "Labels": {
                "kernelversion": "4.4.0-1020-aws",
                "operatingsystem": "Ubuntu 16.04.2 LTS",
                "ostype": "linux",
                "provider": "amazonec2",
                "storagedriver": "aufs"
            }
        });
        td.when(dockerEngineClient.inspectNode('2')).thenReturn({
            "ID": "2",
            "IP": "10.0.1.84",
            "Addr": "10.0.1.84:2376",
            "Name": "dev-swarm-node-02",
            "Cpus": 2,
            "Memory": 4142297088,
            "Labels": {
                "kernelversion": "4.4.0-1020-aws",
                "operatingsystem": "Ubuntu 16.04.2 LTS",
                "ostype": "linux",
                "provider": "amazonec2",
                "storagedriver": "aufs"
            }
        });

        // act
        let actual = await testObj.get();
        // assert
        assert.equal("name", actual.getName());
        assert.equal("1.2.8", actual.getServerVersion());
        assert.equal(2, actual.getNodes().length);
        assert.equal(1, actual.getNode('1').getContainers().length);
        assert.equal(1, actual.getNode('2').getContainers().length);
        assert.deepEqual(containerRepository, actual.containerRepository);
    });

    it('retrieves containers swarmkit', async function () {
        let containers = [container1, container2];

        td.when(dockerEngineClient.getSwarm()).thenReturn({
            Name: "name",
            ServerVersion: "1.2.8",
        });
        td.when(dockerEngineClient.listTasks()).thenReturn(tasks);

        td.when(dockerEngineClient.inspectNode('1')).thenReturn({
            "ID": "1",
            "Version": {
                "Index": 373531
            },
            "CreatedAt": "2016-08-18T10:44:24.496525531Z",
            "UpdatedAt": "2017-08-09T07:09:37.632105588Z",
            "Spec": {
                "Availability": "active",
                "Name": "node-name",
                "Role": "manager",
                "Labels": {
                    "foo": "bar"
                }
            },
            "Description": {
                "Hostname": "bf3067039e47",
                "Platform": {
                    "Architecture": "x86_64",
                    "OS": "linux"
                },
                "Resources": {
                    "NanoCPUs": 4000000000,
                    "MemoryBytes": 8272408576,
                    "GenericResources": [{
                            "DiscreteResourceSpec": {
                                "Kind": "SSD",
                                "Value": 3
                            }
                        },
                        {
                            "NamedResourceSpec": {
                                "Kind": "GPU",
                                "Value": "UUID1"
                            }
                        },
                        {
                            "NamedResourceSpec": {
                                "Kind": "GPU",
                                "Value": "UUID2"
                            }
                        }
                    ]
                },
                "Engine": {
                    "EngineVersion": "17.06.0",
                    "Labels": {
                        "foo": "bar"
                    },
                    "Plugins": [{
                            "Type": "Log",
                            "Name": "awslogs"
                        },
                        {
                            "Type": "Log",
                            "Name": "fluentd"
                        },
                        {
                            "Type": "Log",
                            "Name": "gcplogs"
                        },
                        {
                            "Type": "Log",
                            "Name": "gelf"
                        },
                        {
                            "Type": "Log",
                            "Name": "journald"
                        },
                        {
                            "Type": "Log",
                            "Name": "json-file"
                        },
                        {
                            "Type": "Log",
                            "Name": "logentries"
                        },
                        {
                            "Type": "Log",
                            "Name": "splunk"
                        },
                        {
                            "Type": "Log",
                            "Name": "syslog"
                        },
                        {
                            "Type": "Network",
                            "Name": "bridge"
                        },
                        {
                            "Type": "Network",
                            "Name": "host"
                        },
                        {
                            "Type": "Network",
                            "Name": "ipvlan"
                        },
                        {
                            "Type": "Network",
                            "Name": "macvlan"
                        },
                        {
                            "Type": "Network",
                            "Name": "null"
                        },
                        {
                            "Type": "Network",
                            "Name": "overlay"
                        },
                        {
                            "Type": "Volume",
                            "Name": "local"
                        },
                        {
                            "Type": "Volume",
                            "Name": "localhost:5000/vieux/sshfs:latest"
                        },
                        {
                            "Type": "Volume",
                            "Name": "vieux/sshfs:latest"
                        }
                    ]
                },
                "TLSInfo": {
                    "TrustRoot": "-----BEGIN CERTIFICATE-----\nMIIBajCCARCgAwIBAgIUbYqrLSOSQHoxD8CwG6Bi2PJi9c8wCgYIKoZIzj0EAwIw\nEzERMA8GA1UEAxMIc3dhcm0tY2EwHhcNMTcwNDI0MjE0MzAwWhcNMzcwNDE5MjE0\nMzAwWjATMREwDwYDVQQDEwhzd2FybS1jYTBZMBMGByqGSM49AgEGCCqGSM49AwEH\nA0IABJk/VyMPYdaqDXJb/VXh5n/1Yuv7iNrxV3Qb3l06XD46seovcDWs3IZNV1lf\n3Skyr0ofcchipoiHkXBODojJydSjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMB\nAf8EBTADAQH/MB0GA1UdDgQWBBRUXxuRcnFjDfR/RIAUQab8ZV/n4jAKBggqhkjO\nPQQDAgNIADBFAiAy+JTe6Uc3KyLCMiqGl2GyWGQqQDEcO3/YG36x7om65AIhAJvz\npxv6zFeVEkAEEkqIYi0omA9+CjanB/6Bz4n1uw8H\n-----END CERTIFICATE-----\n",
                    "CertIssuerSubject": "MBMxETAPBgNVBAMTCHN3YXJtLWNh",
                    "CertIssuerPublicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEmT9XIw9h1qoNclv9VeHmf/Vi6/uI2vFXdBveXTpcPjqx6i9wNazchk1XWV/dKTKvSh9xyGKmiIeRcE4OiMnJ1A=="
                }
            },
            "Status": {
                "State": "ready",
                "Message": "",
                "Addr": "172.17.0.2"
            },
            "ManagerStatus": {
                "Leader": true,
                "Reachability": "reachable",
                "Addr": "10.0.0.46:2377"
            }
        });
        td.when(dockerEngineClient.inspectNode('2')).thenReturn({
            "ID": "2",
            "Version": {
                "Index": 373531
            },
            "CreatedAt": "2016-08-18T10:44:24.496525531Z",
            "UpdatedAt": "2017-08-09T07:09:37.632105588Z",
            "Spec": {
                "Availability": "active",
                "Name": "node-name",
                "Role": "manager",
                "Labels": {
                    "foo": "bar"
                }
            },
            "Description": {
                "Hostname": "bf3067039e47",
                "Platform": {
                    "Architecture": "x86_64",
                    "OS": "linux"
                },
                "Resources": {
                    "NanoCPUs": 4000000000,
                    "MemoryBytes": 8272408576,
                    "GenericResources": [{
                            "DiscreteResourceSpec": {
                                "Kind": "SSD",
                                "Value": 3
                            }
                        },
                        {
                            "NamedResourceSpec": {
                                "Kind": "GPU",
                                "Value": "UUID1"
                            }
                        },
                        {
                            "NamedResourceSpec": {
                                "Kind": "GPU",
                                "Value": "UUID2"
                            }
                        }
                    ]
                },
                "Engine": {
                    "EngineVersion": "17.06.0",
                    "Labels": {
                        "foo": "bar"
                    },
                    "Plugins": [{
                            "Type": "Log",
                            "Name": "awslogs"
                        },
                        {
                            "Type": "Log",
                            "Name": "fluentd"
                        },
                        {
                            "Type": "Log",
                            "Name": "gcplogs"
                        },
                        {
                            "Type": "Log",
                            "Name": "gelf"
                        },
                        {
                            "Type": "Log",
                            "Name": "journald"
                        },
                        {
                            "Type": "Log",
                            "Name": "json-file"
                        },
                        {
                            "Type": "Log",
                            "Name": "logentries"
                        },
                        {
                            "Type": "Log",
                            "Name": "splunk"
                        },
                        {
                            "Type": "Log",
                            "Name": "syslog"
                        },
                        {
                            "Type": "Network",
                            "Name": "bridge"
                        },
                        {
                            "Type": "Network",
                            "Name": "host"
                        },
                        {
                            "Type": "Network",
                            "Name": "ipvlan"
                        },
                        {
                            "Type": "Network",
                            "Name": "macvlan"
                        },
                        {
                            "Type": "Network",
                            "Name": "null"
                        },
                        {
                            "Type": "Network",
                            "Name": "overlay"
                        },
                        {
                            "Type": "Volume",
                            "Name": "local"
                        },
                        {
                            "Type": "Volume",
                            "Name": "localhost:5000/vieux/sshfs:latest"
                        },
                        {
                            "Type": "Volume",
                            "Name": "vieux/sshfs:latest"
                        }
                    ]
                },
                "TLSInfo": {
                    "TrustRoot": "-----BEGIN CERTIFICATE-----\nMIIBajCCARCgAwIBAgIUbYqrLSOSQHoxD8CwG6Bi2PJi9c8wCgYIKoZIzj0EAwIw\nEzERMA8GA1UEAxMIc3dhcm0tY2EwHhcNMTcwNDI0MjE0MzAwWhcNMzcwNDE5MjE0\nMzAwWjATMREwDwYDVQQDEwhzd2FybS1jYTBZMBMGByqGSM49AgEGCCqGSM49AwEH\nA0IABJk/VyMPYdaqDXJb/VXh5n/1Yuv7iNrxV3Qb3l06XD46seovcDWs3IZNV1lf\n3Skyr0ofcchipoiHkXBODojJydSjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMB\nAf8EBTADAQH/MB0GA1UdDgQWBBRUXxuRcnFjDfR/RIAUQab8ZV/n4jAKBggqhkjO\nPQQDAgNIADBFAiAy+JTe6Uc3KyLCMiqGl2GyWGQqQDEcO3/YG36x7om65AIhAJvz\npxv6zFeVEkAEEkqIYi0omA9+CjanB/6Bz4n1uw8H\n-----END CERTIFICATE-----\n",
                    "CertIssuerSubject": "MBMxETAPBgNVBAMTCHN3YXJtLWNh",
                    "CertIssuerPublicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEmT9XIw9h1qoNclv9VeHmf/Vi6/uI2vFXdBveXTpcPjqx6i9wNazchk1XWV/dKTKvSh9xyGKmiIeRcE4OiMnJ1A=="
                }
            },
            "Status": {
                "State": "ready",
                "Message": "",
                "Addr": "172.17.0.2"
            },
            "ManagerStatus": {
                "Leader": true,
                "Reachability": "reachable",
                "Addr": "10.0.0.46:2377"
            }
        });

        td.when(containerRepository.getContainer('cnt-1')).thenReturn(container1);
        td.when(containerRepository.getContainer('cnt-2')).thenReturn(container2);

        // act
        let actual = await testObj.get();
        // assert
        assert.equal("name", actual.getName());
        assert.equal("1.2.8", actual.getServerVersion());
        assert.equal(2, actual.getNodes().length);
        assert.equal(1, actual.getNode('1').getContainers().length);
        assert.equal(1, actual.getNode('2').getContainers().length);
        assert.deepEqual(containerRepository, actual.containerRepository);
    });

    afterEach(function () {
        td.reset()
    });
});
