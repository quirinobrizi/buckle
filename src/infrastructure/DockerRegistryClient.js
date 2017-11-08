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

const request = require('request');
const util = require('util');

module.exports = class DockerRegistryClient {

  constructor(configuration) {
    this.uri = configuration.docker.registry.uri
    this.username = configuration.docker.registry.username
    this.password = configuration.docker.registry.password
    this.cache = { 'authentication': {}};
  }

  getHost() {
    return this.uri.replace(/(http|https):\/\//g, '');
  }

  /**
   * List all repositories visible by the logged in username
   * 
   * @method listRepositories
   * @param {integer}
   *          n Limit the number of entries in each response. It not present,
   *          all entries will be returned.
   * @param {integer}
   *          last Result set will include values lexically after last.
   * @return {array} The list of repositories
   */
  listRepositories(n, last) {
    var self = this,
      target = util.format("%s/v2/_catalog", self.uri);
    return new Promise(function(resolve, reject) {
      self._login({
        uri: target
      }).then(function(authenticationContext) {
        request({url: target, method: 'GET', json: true, headers: self._headers(authenticationContext), qs: {n:n, last:last}},
          function(e,r,b) {
            if(e) {
              return reject(e);
            }
            resolve(b.repositories);
          });
      }).catch(reject);
    });
  }

  /**
   * List all tags for the given repository
   * 
   * @method listTags
   * @param {string}
   *          repository The repository name
   * @param {integer}
   *          n Limit the number of entries in each response. If not present,
   *          all entries will be returned.
   * @param {integer}
   *          last Result set will include values lexically after last.
   * @return {array} The list of tags
   */
  listTags(repository,n,last) {
    var self = this,
      target = util.format("%s/v2/%s/tags/list", self.uri, repository);
    return new Promise(function(resolve, reject) {
      self._login({
        uri: target,
        repository: repository
      }).then(function(authenticationContext) {
        request({url: target, method: 'GET', json: true, headers: self._headers(authenticationContext), qs: {n:n, last:last}},
          function(e,r,b) {
            if(e) {
              return reject(e);
            }
            if(r.statusCode !== 200) {
              reject({statusCode: r.statusCode, body: b});
            }
            resolve(b.tags);
          });
      }).catch(reject);
    });
  }

  manifest(repository, tag) {
    var self = this,
      target = util.format("%s/v2/%s/manifests/%s", self.uri, repository, tag);
    return new Promise(function(resolve, reject) {
      self._login({
        uri: target,
        repository: repository
      }).then(function(authenticationContext) {
        request({url: target, method: 'GET', json: true, headers: self._headers(authenticationContext)},
          function(e,r,b) {
            if(e) {
              return reject(e);
            }
            if(r.statusCode !== 200) {
              reject({statusCode: r.statusCode, body: b});
            }
            resolve(b);
          });
      }).catch(reject);
    });
  }

  /**
   * Login to docker registry
   * 
   * @method _login
   * @param {object}
   *          context The request context, contains the request URI and the
   *          repository subject of the action
   * @return {Promise} a promise resolved or rejected with authentication
   *         information
   */
  _login(context) {
    // www-authenticate
    console.log('Target endpoint URI', context.uri);
    var self = this;
    return new Promise(function(resolve, reject) {
      // if(self.cache.authentication[context.uri]) {
      // resolve(self.cache.authentication[context.uri]);
      // } else {
        self._doLogin(context, resolve, reject);
      // }
    });
  }

  _doLogin(context, resolve, reject) {
    var self = this;
    request.get(context.uri)
      .on('response', function(resp) {
        if(resp.statusCode === 401) {
          // extract www-authenticate header
          var challenge = resp.headers['www-authenticate'];
          if(!challenge) {
            reject(Error('received 401 but challenge not found'));
          }
          console.log("challenge received from registry", challenge);
          var challengeParts = challenge.split(' ');
          if(challengeParts.length === 2) {
            var authorizationType = challengeParts[0],
              challengeTargets = challengeParts[1].split(',');
            var realm, service, scope;
            for (var key in challengeTargets) {
              var target = challengeTargets[key];
              if (target.startsWith("realm")) {
                  realm = target.split("=")[1].replace(/\"/g, "");
                  continue;
              }
              if (target.startsWith("service")) {
                  service = target.split("=")[1].replace(/\"/g, "");
                  continue;
              }
              if (target.startsWith("scope")) {
                  scope = target.split("=")[1].replace(/\"/g, "");
                  continue;
              }
            }
            var authorization = util.format("Basic %s", new Buffer(util.format("%s:%s", self.username, self.password)).toString("base64"));
            request(
              {
                'url':realm,
                'qs':{'service': service, 'scope': scope},
                'headers':{'Authorization': authorization},
                'json': true
              },
              function(e,r,b) {
                if(e) {
                  reject(e);
                } else {
                  // self.cache.authentication[context.uri] =
                  // {authorizationType: authorizationType, token: b.token};
                  // resolve(self.cache.authentication[context.uri]);
                  resolve({authorizationType: authorizationType, token: b.token});
                }
              });
          } else {
            reject(Error('unable to handle received authentication challenge'));
          }
        }
      })
      .on('error', reject);
  }

  _headers(authenticationContext) {
    return {
      'Authorization': util.format("%s %s", authenticationContext.authorizationType, authenticationContext.token )
    };
  }
};
