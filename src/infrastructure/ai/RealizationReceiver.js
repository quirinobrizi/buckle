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

const stream = require('stream')
const util = require('util');
const capitalize = require('capitalize');

var RealizationReceiver = function(eventEmitter) {

  this.eventEmitter = eventEmitter;
  this.writable = true;

  this.write = function(chunk) {
    try {
      var event = JSON.parse(chunk.toString('utf8'));
      this.eventEmitter.emit("containers.realization.received", event);
    } catch (e) {
    //   console.error(e);
    }
  };

  this.end = function(chunk) {
    console.log("ON-END");
    if (chunk) {
      this.write(chunk)
    }
  };
};
util.inherits(RealizationReceiver, stream.Stream);

module.exports = RealizationReceiver;
