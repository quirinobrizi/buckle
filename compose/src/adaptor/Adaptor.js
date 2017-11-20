const adaptorHelper = require('./AdaptorHelper');

var VERSION_1 = ['1', '1.0'];
var VERSION_2 = ['2', '2.0', '2.1', '2.2', '2.3'];
var VERSION_3 = ['3', '3.0', '3.1', '3.2', '3.3', '3.4'];

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
        let version = this._getVersion(configuration);
        let answer = {
            containers: Array()
        };
        let containers = adaptorHelper.arrayEquals(VERSION_1, version) ?
            configuration :
            configuration.services;
        answer.containers = Object.keys(containers).map(key => {
            let service = containers[key];
            return {
                name: key,
                configuration: {
                    Hostname: this.extractHostname(service),
                    Domainname: this.extractDomainname(service),
                    User: this.extractUser(service),
                    AttachStdin: this.extractAttachStdin(service),
                    AttachStdout: this.extractAttachStdout(service),
                    AttachStderr: this.extractAttachStderr(service),
                    ExposedPorts: this.extractExposedPorts(service),
                    Tty: this.extractTty(service),
                    OpenStdin: this.extractOpenStdin(service),
                    StdinOnce: this.extractStdinOnce(service),
                    Env: this.extractEnvironmentVariables(service),
                    Cmd: this.extractCmd(service),
                    Healthcheck: this.extractHealthCheck(service),
                    ArgsEscaped: this.extractArgsEscaped(service),
                    Image: this.extractImage(service),
                    Volumes: this.extractVolumes(service),
                    WorkingDir: this.extractWorkingDir(service),
                    Entrypoint: this.extractEntrypoint(service),
                    NetworkDisabled: this.extractNetworkDisabled(service),
                    MacAddress: this.extractMacAddress(service),
                    OnBuild: [], // QB: not supported as of now
                    Labels: this.extractLabels(service),
                    StopSignal: this.extractStopSignal(service),
                    StopTimeout: this.extractStopTimeout(service),
                    Shell: this.extractShell(service),
                    HostConfig: {
                        CpuShares: this.extractCpuShares(service),
                        Memory: this.extractMemory(service),
                        CgroupParent: this.extractCgroupParent(service),
                        BlkioWeight: this.extractBlkioWeight(service),
                        BlkioWeightDevice: this.extractBlkioWeightDevice(service),
                        BlkioDeviceReadBps: this.extractBlkioDeviceReadBps(service),
                        BlkioDeviceWriteBps: this.extractBlkioDeviceWriteBps(service),
                        BlkioDeviceReadIOps: this.extractBlkioDeviceReadIOps(service),
                        BlkioDeviceWriteIOps: this.extractBlkioDeviceWriteIOps(service),
                        CpuPeriod: this.extractCpuPeriod(service),
                        CpuQuota: this.extractCpuQuota(service),
                        CpuRealtimePeriod: this.extractCpuRealtimePeriod(service),
                        CpuRealtimeRuntime: this.extractCpuRealtimeRuntime(service),
                        CpusetCpus: this.extractCpusetCpus(service),
                        CpusetMems: this.extractCpusetMems(service),
                        Devices: this.extractDevices(service),
                        DeviceCgroupRules: this.extractDeviceCgroupRules(service),
                        DiskQuota: this.extractDiskQuota(service),
                        KernelMemory: this.extractKernelMemory(service),
                        MemoryReservation: this.extractMemoryReservation(service),
                        MemorySwap: this.extractMemorySwap(service),
                        MemorySwappiness: this.extractMemorySwappiness(service),
                        NanoCPUs: this.extractNanoCPUs(service),
                        OomKillDisable: this.extractOomKillDisable(service),
                        PidsLimit: this.extractPidsLimit(service),
                        Ulimits: this.extractULimits(service),
                        CpuCount: this.extractCpuCount(service),
                        CpuPercent: this.extractCpuPercent(service),
                        IOMaximumIOps: this.extractIOMaximumIOps(service),
                        IOMaximumBandwidth: this.extractIOMaximumBandwidth(service),
                        Binds: this.extractBinds(service),
                        ContainerIDFile: this.extractContainerIDFile(service),
                        LogConfig: this.extractLogConfig(service),
                        NetworkMode: this.extractNetworkMode(service),
                        PortBindings: this.extractPortBindings(service),
                        RestartPolicy: this.extractRestartPolicy(service),
                        AutoRemove: this.extractAutoRemove(service),
                        VolumeDriver: this.extractVolumeDriver(service),
                        VolumesFrom: this.extractVolumesFrom(service),
                        Mounts: this.extractMounts(service),
                        CapAdd: this.extractCapAdd(service),
                        CapDrop: this.extractCapDrop(service),
                        Dns: this.extractDns(service),
                        DnsOptions: this.extractDnsOptions(service),
                        DnsSearch: this.extractDnsSearch(service),
                        ExtraHosts: this.extractExtrHosts(service),
                        GroupAdd: this.extractGroupAdd(service),
                        IpcMode: this.extractIpcMode(service),
                        Cgroup: this.extractCgroup(service),
                        Links: this.extractLinks(service),
                        OomScoreAdj: this.extractOomScoreAdj(service),
                        PidMode: this.extractPidMode(service),
                        Privileged: this.extractPrivileged(service),
                        PublishAllPorts: this.extractPublishAllPorts(service),
                        ReadonlyRootfs: this.extractReadonlyRootfs(service),
                        SecurityOpt: this.extractSecurityOptions(service),
                        StorageOpt: this.extractStorageOpt(service),
                        Tmpfs: this.extractTmpfs(service),
                        UTSMode: this.extractUTSMode(service),
                        UsernsMode: this.extractUsernsMode(service),
                        ShmSize: this.extractShmSize(service),
                        Sysctls: this.extractSysctls(service),
                        Runtime: this.extractRuntime(service),
                        ConsoleSize: this.extractConsoleSize(service),
                        Isolation: this.extractIsolation(service)
                    },
                    NetworkingConfig: this.extractNetworkingConfig(service)
                }
            };
        });

        if(this.isVersion2OrAbove(version)) {
            // evaluate dependency order for services if defined
            answer.dependency = Object.keys(containers).map(key => {
                let service = containers[key];
                return {
                    name: key,
                    order: this.extractDependencyOrder(service)
                }
            });
        }

        return answer;
    }

    _getVersion(configuration) {
        if(!configuration.version || VERSION_1.includes(configuration.version)) {
            return VERSION_1;
        } else if (VERSION_2.includes(configuration.version)) {
            return VERSION_2
        } else if (VERSION_3.includes(configuration.version)) {
            return VERSION_3;
        }
    }

    isVersion2OrAbove(version) {
        return adaptorHelper.arrayEquals(VERSION_2, version) || adaptorHelper.arrayEquals(VERSION_3, version);
    }

    extractDependencyOrder(service) {
        if(service.depends_on) {
            return service.depends_on.map(dep => {
                let answer = {};
                if(typeof dep === 'object') {
                    answer.container = 
                } else {
                    answer.container = dep;
                }
                return answer;
            });
        }
        return [];
    }

    extractHostname(service) {
        return service.hostname;
    }

    extractDomainname(service) {
        return service.domainname;
    }

    extractUser(service) {
        return service.user;
    }

    extractAttachStdin(service) {
        return service.attachstdin || false;
    }

    extractAttachStdout(service) {
        return service.AttachStdout || true;
    }

    extractAttachStderr(service) {
        return service.AttachStderr || true;
    }

    extractTty(service) {
        return service.tty || false;
    }

    extractOpenStdin(service) {
        return service.stdin_open || false;
    }

    extractStdinOnce(service) {
        throw new Error('not implemented');
    }

    extractHealthCheck(service) {
        throw new Error('not implemented');
    }

    extractArgsEscaped(service) {
        throw new Error('not implemented');
    }

    extractVolumes(service) {
        return adaptorHelper.parseVolumes(service.volumes);
    }

    extractWorkingDir(service) {
        return service.working_dir;
    }

    extractCpuShares(service) {
        return service.cpu_shares;
    }

    extractMemory(service) {
        throw new Error('not implemented');
    }

    extractBlkioWeight(service) {
        throw new Error('not implemented');
    }

    extractBlkioWeightDevice(service) {
        throw new Error('not implemented');
    }

    extractBlkioDeviceReadBps(service) {
        throw new Error('not implemented');
    }

    extractBlkioDeviceWriteBps(service) {
        throw new Error('not implemented');
    }

    extractBlkioDeviceReadIOps(service) {
        throw new Error('not implemented');
    }

    extractBlkioDeviceWriteIOps(service) {
        throw new Error('not implemented');
    }

    extractCpuPeriod(service) {
        throw new Error('not implemented');
    }

    extractCpuQuota(service) {
        return service.cpu_quota;
    }

    extractCpuRealtimePeriod(service) {
        throw new Error('not implemented');
    }

    extractCpuRealtimeRuntime(service) {
        throw new Error('not implemented');
    }

    extractCpusetCpus(service) {
        return service.cpuset;
    }

    extractCpusetMems(service) {
        throw new Error('not implemented');
    }

    extractDevices(service) {
        return adaptorHelper.parseDevices(service.devices);
    }

    extractDeviceCgroupRules(service) {
        throw new Error('not implemented');
    }

    extractDiskQuota(service) {
        throw new Error('not implemented');
    }

    extractCmd(service) {
        return service.command;
    }

    extractEntrypoint(service) {
        return service.entrypoint;
    }

    extractNetworkDisabled(service) {
        throw new Error('not implemented');
    }

    extractMacAddress(service) {
        return service.mac_address;
    }

    extractStopTimeout(service) {
        return service.stop_timeout || 10;
    }

    extractShell(service) {
        throw new Error('not implemented');
    }

    extractEnvironmentVariables(service) {
        return adaptorHelper.parseEnvironmentVariables(service.environment);
    }

    extractExposedPorts(service) {
        return adaptorHelper.parseExposedPorts(service.expose);
    }

    extractImage(service) {
        return service.image;
    }

    extractLabels(service) {
        return adaptorHelper.parseLabels(service.labels);
    }

    extractStopSignal(service) {
        return service.stop_signal;
    }

    extractCgroupParent(service) {
        return service.cgroup_parent;
    }

    extractCapAdd(service) {
        return service.cap_add;
    }

    extractCapDrop(service) {
        return service.cap_drop;
    }

    extractDns(service) {
        return Array.isArray(service.dns) ? service.dns : [service.dns];
    }

    extractDnsSearch(service) {
        return Array.isArray(service.dns_search) ? service.dns : [service.dns_search];
    }

    extractDnsOptions(service) {
        throw new Error('not implemented');
    }

    extractExtrHosts(service) {
        return service.extra_hosts;
    }

    extractLinks(service) {
        return service.links;
    }

    extractLogConfig(service) {
        return {
            Type: service.log_driver,
            Config: service.log_opt
        };
    }

    extractNetworkMode(service) {
        throw new Error('not implemented');
    }

    extractPortBindings(service) {
        return adaptorHelper.parsePortBindings(service.ports);
    }

    extractSecurityOptions(service) {
        return service.security_opt;
    }

    extractULimits(service) {
        return adaptorHelper.parseUlimits(service.ulimits);
    }

    extractCpuCount(service) {
        throw new Error('not implemented');
    }

    extractKernelMemory(service) {
        throw new Error('not implemented');
    }

    extractMemoryReservation(service) {
        throw new Error('not implemented');
    }

    extractMemorySwap(service) {
        throw new Error('not implemented');
    }

    extractMemorySwappiness(service) {
        throw new Error('not implemented');
    }

    extractNanoCPUs(service) {
        throw new Error('not implemented');
    }

    extractOomKillDisable(service) {
        throw new Error('not implemented');
    }

    extractPidsLimit(service) {
        throw new Error('not implemented');
    }

    extractCpuPercent(service) {
        throw new Error('not implemented');
    }

    extractIOMaximumIOps(service) {
        throw new Error('not implemented');
    }

    extractIOMaximumBandwidth(service) {
        throw new Error('not implemented');
    }

    extractBinds(service) {
        return service.volumes;
    }

    extractContainerIDFile(service) {
        throw new Error('not implemented');
    }

    extractRestartPolicy(service) {
        throw new Error('not implemented');
    }

    extractAutoRemove(service) {
        throw new Error('not implemented');
    }

    extractVolumeDriver(service) {
        return service.volume_driver;
    }

    extractVolumesFrom(service) {
        return service.volume_from;
    }

    extractMounts(service) {
        throw new Error('not implemented');
    }

    extractGroupAdd(service) {
        throw new Error('not implemented');
    }

    extractIpcMode(service) {
        return service.ipc;
    }

    extractCgroup(service) {
        throw new Error('not implemented');
    }

    extractOomScoreAdj(service) {
        throw new Error('not implemented');
    }

    extractPidMode(service) {
        return service.pid;
    }

    extractPrivileged(service) {
        return service.priviledged;
    }

    extractPublishAllPorts(service) {
        throw new Error('not implemented');
    }

    extractReadonlyRootfs(service) {
        return service.read_only;
    }

    extractStorageOpt(service) {
        throw new Error('not implemented');
    }

    extractTmpfs(service) {
        throw new Error('not implemented');
    }

    extractUTSMode(service) {
        throw new Error('not implemented');
    }

    extractUsernsMode(service) {
        throw new Error('not implemented');
    }

    extractShmSize(service) {
        return service.shm_size;
    }

    extractSysctls(service) {
        throw new Error('not implemented');
    }

    extractRuntime(service) {
        throw new Error('not implemented');
    }

    extractConsoleSize(service) {
        throw new Error('not implemented');
    }

    extractIsolation(service) {
        throw new Error('not implemented');
    }

    extractNetworkingConfig(service) {
        throw new Error('not implemented');
    }

};
