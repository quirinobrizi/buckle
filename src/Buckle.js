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

const cluster = require('cluster');
const config = require('config');

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const path = require('path');
const url = require('url');
const jwt = require('express-jwt');

const logger = require('./infrastructure/Logger');
const applicationContext = require('./infrastructure/config/ApplicationContext');

var restarts = 0;
if (cluster.isMaster) {
    cluster.fork();
    cluster.on('exit', worker => {
        console.log('worker %s died. restart...', worker.process.pid);
        if (restarts < 10) {
            cluster.fork();
            restarts++;
        }
    });
} else {
    main();
}

function main() {
    var app = express();
    var io = null;
    var server = null;
    var listeners = config.buckle.event.listeners || [];
    var router = express.Router();

    let container = applicationContext.load(config);

    if (config.buckle.cometd.enabled) {
        listeners.push("./listener/cometd");
    }

    app.use(bodyParser.json({
        type: 'application/json'
    }));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(jwt({
        secret: config.buckle.authentication.jwt.secret
    }).unless({
        path: ['/buckle/rest/auth/token']
    }));
    container.resolve('restRoutesBuilder').buildRoutes(container, router);
    app.use('/buckle/rest', router);
    app.use('/buckle', express.static(path.join(__dirname, '../ui'), {
        fallthrough: false
    }));

    if (!config.buckle.http.enabled && !config.buckle.https.enabled) {
        throw Error("at least one between HTTP or HTTPS need to be enabled");
    }

    if (config.buckle.http.enabled) {
        const http = require('http');
        if (config.buckle.cometd.enabled) {
            server = http.createServer(app);
            io = require('socket.io')(server, {
                path: '/buckle/socket.io'
            });
            server.timeout = 600000;
            server.listen(config.buckle.http.port || 8080);
        } else {
            server = http.createServer(app);
            server.timeout = 600000;
            server.listen(config.buckle.http.port || 8080);
        }
    }

    if (config.buckle.https.enabled) {
        const https = require('https');
        if (config.buckle.cometd.enabled) {
            server = https.createServer({
                ca: [config.buckle.https.ca],
                cert: config.buckle.https.cert,
                key: config.buckle.https.key
            }, app);
            io = require('socket.io')(server);
            server.timeout = 600000;
            server.listen(config.buckle.https.port || 8443);
        } else {
            server = https.createServer({
                ca: [config.buckle.https.ca],
                cert: config.buckle.https.cert,
                key: config.buckle.https.key
            }, app);
            server.timeout = 600000;
            server.listen(config.buckle.https.port || 8443);
        }
    }

    var environmentMonitor = container.resolve('environmentMonitor');
    environmentMonitor.registerListeners(listeners);
    environmentMonitor.monitor();
    container.resolve('anomalyInterface').registerListener();
    container.resolve('environmentInterface').registerListener();

    if (config.buckle.cometd.enabled && io) {
        listeners.push("./listener/cometd");
        io.on('connection', function (socket) {
            logger.info('a new client is connected [%j]', socket);

            socket.on('disconnect', function () {
                logger.info('a client is disconnected');
            });
        });

        container.resolve('eventEmitter').on('event', msg => {
            io.emit("/topic/events", msg);
        });
    }

    logger.info("Eureka enabled: [%s]", config.buckle.eureka.enabled);
    if ('true' === config.buckle.eureka.enabled) {
        const Eureka = require('./infrastructure/Eureka');
        var eurekaClient = new Eureka(config);
        eurekaClient.connect();
    }

    app.use(function (err, req, res, next) {
        logger.error(err.stack)
        res.status(500).send('Something broke!')
    });

    process.on('unhandledRejection', function (err) {
        logger.error("caught and unhandled rejection");
        logger.error(err);
        console.error(err);
    });

    process.on('uncaughtException', function (err) {
        logger.error("caught and unhandled exception");
        logger.error(err.stack);
        process.exit(1);
    });
}
