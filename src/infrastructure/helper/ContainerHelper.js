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

module.exports = {

  extractClusterName : function(getName) {
    var containerMatch = /\/(.*)\/(?:[a-zA-Z0-9]+_){0,1}([a-zA-Z0-9-]+)/g.exec(getName);
    if (!containerMatch) {
      containerMatch = /.*_(.*)_.*/g.exec(getName);
    }
    return containerMatch ? containerMatch[2] || containerMatch[1] : null;
  },

  extractContainerNode : function(getName) {
    var containerMatch = /\/(.*)\/(?:[a-zA-Z0-9]+_){0,1}([a-zA-Z0-9-]+)/g.exec(getName);
    return containerMatch ? containerMatch[1] || 'unknown' : 'unknown';
  },

  extractImage : function(repoTag, repoDigest) {
    var imageMatch;
    if (repoTag) {
      imageMatch = /([^:]*):?(.*)$/g.exec(repoTag);
    } else {
      imageMatch = /(.+)@.*/g.exec(repoDigest);
    }
    return imageMatch[1];
  },

  extractVersion : function(repoTag, repoDigest) {
    var imageMatch;
    if (repoTag) {
      imageMatch = /([^:]*):?(.*)$/g.exec(repoTag);
    } else {
      imageMatch = /(.+)@.*/g.exec(repoDigest);
    }
    return imageMatch[2] || 'unknown';
  }
};
