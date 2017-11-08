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
  handleError: function(eventEmitter, err, req, res) {
    console.error("received error %j", err);
    var statusCode = (!err.statusCode || err.statusCode == 0) ? 500 : err.statusCode,
      message = !err.error ? !err.body ? { message: "Internal Server Error" } : err.body : err.error;
      eventEmitter.emit('event', {message: message, payload: err});
      res.status(statusCode).send(message);
  },

  handleSuccess: function(eventEmitter, res, message, payload) {
    eventEmitter.emit('event', {message: message, payload: payload});
    res.status(200).json(payload);
  },

  handleApiError: function(err, req, res) {
    console.error("received error: ", err.stack);
    var statusCode = (!err.statusCode || err.statusCode == 0) ? 500 : err.statusCode,
      message = !err.error ? !err.body ? { message: "Internal Server Error" } : err.body : err.error;
      res.status(statusCode).send(message);
  },
};
