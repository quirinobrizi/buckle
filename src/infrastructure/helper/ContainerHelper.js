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


const logger = require('../Logger');

module.exports = {

    /**
     * Extract the container name, the input is expected to be the response from Docker engine APIs
     * @method extractContainerName
     * @param  {object}    container the container definition from Docker engine
     * @return {string}              the container name
     */
    extractContainerName: function(container) {
        if (container.Labels && container.Labels['org.buckle.cluster']) {
            return container.Labels['org.buckle.cluster'];
        } else if (container.Config && container.Config.Labels && container.Config.Labels['org.buckle.cluster']) {
            return container.Config.Labels['org.buckle.cluster'];
        } else {
            var name = container.Name;
            if (!name) {
                name = container.Names[0];
            }
            var containerMatch = /\/(.*)\/(?:[a-zA-Z0-9]+_){0,1}([a-zA-Z0-9-]+)/g.exec(name);
            if (!containerMatch) {
                containerMatch = /.*_(.*)_.*/g.exec(name);
            }
            if (!containerMatch) {
                containerMatch = /\/(.*)\.\d+\..*/g.exec(name)
            }
            return containerMatch ? containerMatch[2] || containerMatch[1] : name.replace(/^\//, '');
        }
    },

    /**
     * Extract the image from the provided container, the input is expected to be the response from Docker engine APIs
     * @method extractImage
     * @param  {object}    container the container definition from Docker engine
     * @return {string}              the container image
     */
    extractContainerImage: function(container) {
        if (container.Image.startsWith("sha256")) {
            return container.Config ? container.Config.Image : 'unknown';
        }
        if (container.Image.includes('@')) {
            return container.Image.split('@')[0];
        }
        return container.Image
    },

    extractClusterName: function(getName) {
        var containerMatch = /\/(.*)\/(?:[a-zA-Z0-9]+_){0,1}([a-zA-Z0-9-]+)/g.exec(getName);
        if (!containerMatch) {
            containerMatch = /.*_(.*)_.*/g.exec(getName);
        }
        return containerMatch ? containerMatch[2] || containerMatch[1] : null;
    },

    extractContainerNode: function(getName) {
        var containerMatch = /\/(.*)\/(?:[a-zA-Z0-9]+_){0,1}([a-zA-Z0-9-]+)/g.exec(getName);
        return containerMatch ? containerMatch[1] || 'unknown' : 'unknown';
    },

    extractImage: function(repoTag, repoDigest) {
        var imageMatch;
        if (repoTag) {
            imageMatch = /([^:]*):?(.*)$/g.exec(repoTag);
        } else {
            imageMatch = /(.+)@.*/g.exec(repoDigest);
        }
        return imageMatch[1];
    },

    extractVersion: function(repoTag, repoDigest) {
        var imageMatch;
        if (repoTag) {
            imageMatch = /([^:]*):?(.*)$/g.exec(repoTag);
        } else {
            imageMatch = /(.+)@.*/g.exec(repoDigest);
        }
        return imageMatch[2] || 'unknown';
    },

    defineDeploymentOrder(configuration) {
        var answer = [];
        if (configuration.dependencies && configuration.dependencies.length > 0) {
            for (let i = 0; i < configuration.dependencies.length; i++) {
                let dependency = configuration.dependencies[i];
                logger.info("inspecting dependency %s at position %s", dependency.name, i);
                if (!dependency.order || dependency.order.length == 0) {
                    if (!answer.includes(dependency.name)) {
                        logger.info("add dependency %s", dependency.name);
                        // does not have dependencies, can start as first
                        answer.push(dependency.name);
                    }
                } else {
                    // does have dependencies add the dependency and after the dependent
                    for (let j = 0; j < dependency.order.length; j++) {
                        let dep = dependency.order[j];
                        if (!answer.includes(dep)) {
                            logger.info("add dependency %s", dep);
                            answer.push(dep);
                        }
                    }
                    if (!answer.includes(dependency.name)) {
                        logger.info("add dependency %s", dependency.name);
                        answer.push(dependency.name);
                    }
                }
            }
        } else {
            answer = Object.keys(configuration.containers);
        }
        logger.info("order evaluated as %s", answer);
        return answer;
    }
};
