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

const util = require('util');

const logger = require('../Logger');

module.exports = class ScaleContainerAdaptor {
    constructor() {}

    adapt(inputs, image, tag, clusterId) {
        var _tag = tag || 'latest';
        logger.info("adapting container info for scale container request with image %s and tag %s", image, _tag);
        if (logger.debug) {
            logger.debug("Current container configuration: %s", JSON.stringify(inputs));
        }
        try {
            var labels = Object.assign({
                'org.buckle.version': '1',
                'org.buckle.cluster': clusterId,
                'org.buckle.cluster.container.version': _tag
            }, inputs.Config.Labels);

            var config = {
                Domainname: inputs.Config.Domainname,
                User: inputs.Config.User,
                AttachStdin: inputs.Config.AttachStdin || false,
                AttachStdout: inputs.Config.AttachStdout || true,
                AttachStderr: inputs.Config.AttachStderr || true,
                ExposedPorts: inputs.Config.ExposedPorts,
                Tty: inputs.Config.Tty || false,
                OpenStdin: inputs.Config.OpenStdin || false,
                StdinOnce: inputs.Config.StdinOnce || false,
                Env: inputs.Config.Env,
                Cmd: inputs.Config.Cmd,
                Healthcheck: inputs.Healthcheck,
                ArgsEscaped: inputs.ArgsEscaped,
                Image: util.format("%s:%s", image, _tag),
                Volumes: inputs.Config.Volumes,
                WorkingDir: inputs.Config.WorkingDir,
                Entrypoint: inputs.Config.Entrypoint,
                NetworkDisabled: inputs.NetworkDisabled,
                OnBuild: inputs.OnBuild,
                Labels: labels,
                StopSignal: inputs.StopSignal,
                StopTimeout: inputs.StopTimeout,
                Shell: inputs.Shell,
                HostConfig: {
                    CgroupParent: inputs.HostConfig.CgroupParent,
                    BlkioWeight: inputs.HostConfig.BlkioWeight,
                    BlkioWeightDevice: inputs.HostConfig.BlkioWeightDevice,
                    BlkioDeviceReadBps: inputs.HostConfig.BlkioDeviceReadBps,
                    BlkioDeviceWriteBps: inputs.HostConfig.BlkioDeviceWriteBps,
                    BlkioDeviceReadIOps: inputs.HostConfig.BlkioDeviceReadIOps,
                    BlkioDeviceWriteIOps: inputs.HostConfig.BlkioDeviceWriteIOps,
                    CpuPeriod: 0,
                    CpuQuota: 0,
                    CpuShares: inputs.HostConfig.CpuShares,
                    CpuRealtimePeriod: inputs.HostConfig.CpuRealtimePeriod,
                    CpuRealtimeRuntime: inputs.HostConfig.CpuRealtimeRuntime,
                    CpusetCpus: inputs.HostConfig.CpusetCpus,
                    CpusetMems: inputs.HostConfig.CpusetMems,
                    Devices: inputs.HostConfig.Devices,
                    DeviceCgroupRules: inputs.HostConfig.DeviceCgroupRules,
                    DiskQuota: inputs.HostConfig.DiskQuota,
                    Memory: inputs.HostConfig.Memory,
                    KernelMemory: inputs.HostConfig.KernelMemory,
                    MemoryReservation: inputs.HostConfig.MemoryReservation,
                    MemorySwap: inputs.HostConfig.MemorySwap,
                    MemorySwappiness: inputs.HostConfig.MemorySwappiness,
                    NanoCPUs: inputs.HostConfig.NanoCPUs,
                    OomKillDisable: inputs.HostConfig.OomKillDisable,
                    PidsLimit: inputs.HostConfig.PidsLimit,
                    Ulimits: inputs.HostConfig.Ulimits,
                    CpuCount: inputs.HostConfig.CpuCount,
                    CpuPercent: inputs.HostConfig.CpuPercent,
                    IOMaximumIOps: inputs.HostConfig.IOMaximumIOps,
                    IOMaximumBandwidth: inputs.HostConfig.IOMaximumBandwidth,
                    Binds: inputs.HostConfig.Binds,
                    ContainerIDFile: inputs.HostConfig.getContainerIdFile,
                    LogConfig: inputs.HostConfig.LogConfig,
                    NetworkMode: inputs.HostConfig.NetworkMode,
                    PortBindings: inputs.HostConfig.PortBindings,
                    RestartPolicy: inputs.HostConfig.RestartPolicy,
                    AutoRemove: inputs.HostConfig.AutoRemove,
                    VolumeDriver: inputs.HostConfig.VolumeDriver,
                    VolumesFrom: inputs.HostConfig.VolumesFrom,
                    Mounts: inputs.HostConfig.Mounts,
                    CapAdd: inputs.HostConfig.CapAdd,
                    CapDrop: inputs.HostConfig.CapDrop,
                    Dns: inputs.HostConfig.Dns,
                    DnsOptions: inputs.HostConfig.DnsOptions,
                    DnsSearch: inputs.HostConfig.DnsSearch,
                    ExtraHosts: inputs.HostConfig.ExtraHosts,
                    GroupAdd: inputs.HostConfig.GroupAdd,
                    IpcMode: inputs.HostConfig.IpcMode,
                    Cgroup: inputs.HostConfig.Cgroup,
                    Links: inputs.HostConfig.Links,
                    OomScoreAdj: inputs.HostConfig.OomScoreAdj,
                    PidMode: inputs.HostConfig.PidMode,
                    Privileged: inputs.HostConfig.Privileged,
                    PublishAllPorts: inputs.HostConfig.PublishAllPorts,
                    ReadonlyRootfs: inputs.HostConfig.ReadonlyRootfs,
                    SecurityOpt: inputs.HostConfig.SecurityOpt,
                    StorageOpt: inputs.HostConfig.StorageOpt,
                    Tmpfs: inputs.HostConfig.Tmpfs,
                    UTSMode: inputs.HostConfig.UTSMode,
                    UsernsMode: inputs.HostConfig.UsernsMode,
                    ShmSize: inputs.HostConfig.ShmSize,
                    Sysctls: inputs.HostConfig.Sysctls,
                    Runtime: inputs.HostConfig.Runtime,
                    ConsoleSize: inputs.HostConfig.ConsoleSize,
                    Isolation: inputs.HostConfig.Isolation
                },
                NetworkingConfig: {
                    EndpointsConfig: {}
                }
            };
            this._configureNetworking(config, inputs, clusterId);
            if (logger.debug) {
                logger.debug('generated configuration [%j]', config);
            }
            return config;
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }

    _configureNetworking(config, inputs, clusterId) {
        var networks = inputs.NetworkSettings.Networks || {};
        for (let key in networks) {
            if(!networks.hasOwnProperty(key)) {
                continue;
            }
            let network = networks[key];
            if(!network) {
                logger.info("unable to extract network %s", key);
                continue;
            }
            logger.info("copying network configuration for %s actual config %s", key, JSON.stringify(network));
            config.NetworkingConfig.EndpointsConfig[key] = {
                Links: network.Links,
                Aliases: this._buildAliases(key, network, clusterId)
            };
        }
        return config;
    }

    _buildAliases(type, network, clusterId) {
        if(['default', 'bridge'].includes(type)) {
            return null;
        } else {
            if(network.Aliases) {
                var aliases = network.Aliases;
                aliases.push(clusterId);
                return aliases;
            } else {
                return [clusterId];
            }
        }
    }
}
