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

module.exports = class Event {

    constructor(id, type, action, time, actor) {
        this.id = id;
        this.type = type;
        this.action = action;
        this.time = time;
        this.actor = actor;
    }

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    getAction() {
        return this.action;
    }

    getTime() {
        return this.time;
    }

    getActor() {
        return this.actor;
    }

    static newInstance(id, type, action, time, actor) {
        return new Event(id, type, action, time, actor);
    }
}
