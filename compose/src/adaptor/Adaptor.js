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
                        Cmd: this.extractCmd(service),
                        Entrypoint: this.extractEntrypoint(service),
                        Env: this.extractEnvironmentVariables(service),
                        ExposedPorts: this.extractExposedPorts(service),
                        Image: this.extractImage(service),
                        Labels: this.extractLabels(service),
                        StopSignal: this.extractStopSignal(service),
                        HostConfig: {
                            CpuShares: this.extractCpuShares(service),
                            Memory: this.extractMemory(service),
                            BlkioWeight: this.extractBlkioWeight(service),
                            BlkioWeightDevice: this.extractBlkioWeightDevice(service),
                            CpuPeriod: this.extractCpuPeriod(service),
                            CpuQuota: this.extractCpuQuota(service),
                            CpuRealtimePeriod: this.extractCpuRealtimePeriod(service),
                            CpuRealtimeRuntime: this.extractCpuRealtimeRuntime(service),
                            CpusetCpus: this.extractCpusetCpus(service),
                            CpusetMems: this.extractCpusetMems(service),
                            Devices: this.extractDevices(service),
                            DeviceCgroupRules: this.extractDeviceCgroupRules(service),
                            DiskQuota: this.extractDiskQuota(service),
                            CgroupParent: this.extractCgroupParent(service),
                            CapAdd: this.extractCapAdd(service),
                            CapDrop: this.extractCapDrop(service),
                            Dns: this.extractDns(service),
                            DnsSearch: this.extractDnsSearch(service),
                            ExtraHosts: this.extractExtrHosts(service),
                            Links: this.extractLinks(service),
                            LogConfig: this.extractLogConfig(service),
                            NetworkMode: this.extractNetworkMode(service),
                            PortBindings: this.extractPortBindings(service),
                            SecurityOpt: this.extractSecurityOptions(service),
                            Ulimits: this.extractULimits(service),
                            CpuCount: this.extractCpuCount(service)
                        }
                    }
                });
            }
        }
        return answer;
    }

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
};
