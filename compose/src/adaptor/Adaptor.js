const adaptorHelper = require('./AdaptorHelper');

module.exports = class Adaptor {

    constructor() {}

    /**
     * Convert the provided configuration into a set of deployable containers.
     * The configuration describes the consolidated view of the containers.
     *
     * @param  {Object} configurations the containers configuration
     * @return {Array.<Object>s}       the containers to deploy
     */
    adapt(configuration) {
        let answer = Array();
        for (let key in configuration) {
            if (configuration.hasOwnProperty(key)) {
                let service = configuration[key];
                answer.push({
                    name: key,
                    configuration: {
                        Hostname:this.extractHostname(service),
                        Domainname: this.extractDomainname(service),
                        User: this.extractUser(service),
                        AttachStdin: this.extractAttachStdin(service),
                        AttachStdout: this.extractAttachStdout(service),
                        AttachStderr: this.extractAttachStderr(service),
                        ExposedPorts: this.extractExposedPorts(service),
                        Tty:
                        OpenStdin
                        StdinOnce
                        Env: this.extractEnvironmentVariables(service),
                        Cmd: this.extractCmd(service),
                        Healthcheck:
                        ArgsEscaped:
                        Image: this.extractImage(service),
                        Volumes:
                        WorkingDir:
                        Entrypoint: this.extractEntrypoint(service),
                        NetworkDisabled:
                        MacAddress:
                        OnBuild:
                        Labels: this.extractLabels(service),
                        StopSignal: this.extractStopSignal(service),
                        StopTimeout:
                        Shell:
                        HostConfig: {
                            CpuShares: this.extractCpuShares(service),
                            Memory: this.extractMemory(service),
                            CgroupParent: this.extractCgroupParent(service),
                            BlkioWeight: this.extractBlkioWeight(service),
                            BlkioWeightDevice: this.extractBlkioWeightDevice(service),
                            BlkioDeviceReadBps:
                            BlkioDeviceWriteBps:
                            BlkioDeviceReadIOps:
                            BlkioDeviceWriteIOps:
                            CpuPeriod: this.extractCpuPeriod(service),
                            CpuQuota: this.extractCpuQuota(service),
                            CpuRealtimePeriod: this.extractCpuRealtimePeriod(service),
                            CpuRealtimeRuntime: this.extractCpuRealtimeRuntime(service),
                            CpusetCpus: this.extractCpusetCpus(service),
                            CpusetMems: this.extractCpusetMems(service),
                            Devices: this.extractDevices(service),
                            DeviceCgroupRules: this.extractDeviceCgroupRules(service),
                            DiskQuota: this.extractDiskQuota(service),
                            KernelMemory:
                            MemoryReservation:
                            MemoryReservation:
                            MemorySwappiness:
                            NanoCPUs:
                            OomKillDisable:
                            PidsLimit:
                            Ulimits: this.extractULimits(service),
                            CpuCount: this.extractCpuCount(service),
                            CpuPercent:
                            IOMaximumIOps:
                            IOMaximumBandwidth:
                            Binds:
                            ContainerIDFile:
                            LogConfig: this.extractLogConfig(service),
                            NetworkMode: this.extractNetworkMode(service),
                            PortBindings: this.extractPortBindings(service),
                            RestartPolicy:
                            AutoRemove:
                            VolumeDriver:
                            VolumesFrom:
                            Mounts:
                            CapAdd: this.extractCapAdd(service),
                            CapDrop: this.extractCapDrop(service),
                            Dns: this.extractDns(service),
                            DnsOptions:
                            DnsSearch: this.extractDnsSearch(service),
                            ExtraHosts: this.extractExtrHosts(service),
                            GroupAdd:
                            IpcMode:
                            Cgroup:
                            Links: this.extractLinks(service),
                            OomScoreAdj:
                            PidMode:
                            Privileged:
                            PublishAllPorts:
                            ReadonlyRootfs:
                            SecurityOpt: this.extractSecurityOptions(service),
                            StorageOpt:
                            Tmpfs:
                            UTSMode:
                            UsernsMode:
                            ShmSize:
                            Sysctls:
                            Runtime:
                            ConsoleSize:
                            Isolation:
                        },
                        NetworkingConfig: this.extractNetworkingConfig(service);
                    }
                });
            }
        }
        return answer;
    }

    extractHostname(service) { return service.hostname; }

    extractDomainname(service) { return service.domainname; }

    extractUser(service) { return service.user; }

    extractAttachStdin(service) { return service.attachstdin || false; }

    extractAttachStdout(service){ return service.AttachStdout || true; }

    extractAttachStderr(service) { return service.AttachStderr || true; }

    extractCpuShares(service) { return service.cpu_shares; }

    extractMemory(service) { throw new Error('not implemented'); }

    extractBlkioWeight(service) { throw new Error('not implemented'); }

    extractBlkioWeightDevice(service){ throw new Error('not implemented'); }

    extractCpuPeriod(service) { throw new Error('not implemented'); }

    extractCpuQuota(service) { return service.cpu_quota; }

    extractCpuRealtimePeriod(service) { throw new Error('not implemented'); }

    extractCpuRealtimeRuntime(service) { throw new Error('not implemented'); }

    extractCpusetCpus(service) { return service.cpuset; }

    extractCpusetMems(service) { throw new Error('not implemented'); }

    extractDevices(service) { return adaptorHelper.parseDevices(service.devices); }

    extractDeviceCgroupRules(service) { throw new Error('not implemented'); }

    extractDiskQuota(service) { throw new Error('not implemented'); }

    extractCmd(service) { return service.command; }

    extractEntrypoint(service) { return service.entrypoint; }

    extractEnvironmentVariables(service) {
        return adaptorHelper.parseEnvironmentVariables(service.environment);
    }

    extractExposedPorts(service) {
        return adaptorHelper.parseExposedPorts(service.expose);
    }

    extractImage(service) { return service.image; }

    extractLabels(service) {
        return adaptorHelper.parseLabels(service.labels);
    }

    extractStopSignal(service) { return service.stop_signal; }

    extractCgroupParent(service) { return service.cgroup_parent; }

    extractCapAdd(service) { return service.cap_add; }

    extractCapDrop(service) { return service.cap_drop; }

    extractDns(service) {
        return Array.isArray(service.dns) ? service.dns : [service.dns];
    }

    extractDnsSearch(service) {
        return Array.isArray(service.dns_search) ? service.dns : [service.dns_search];
    }

    extractExtrHosts(service) { return service.extra_hosts; }

    extractLinks(service) { return service.links; }

    extractLogConfig(service) {
        return {
            Type: service.log_driver,
            Config: service.log_opt
        };
    }

    extractNetworkMode(service) { throw new Error('not implemented'); }

    extractPortBindings(service) {
        return adaptorHelper.parsePortBindings(service.ports);
    }

    extractSecurityOptions(service) {
        return service.security_opt;
    }

    extractULimits(service) {
        return adaptorHelper.parseUlimits(service.ulimits);
    }

    extractCpuCount(service) { throw new Error('not implemented'); }

    extractNetworkingConfig(service) { throw new Error('not implemented'); }
};
