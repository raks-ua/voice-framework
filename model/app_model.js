'use strict';

let AlexaModel = require('./alexa_model');
let GoogleModel = require('./google_model');
let ClovaModel = require('./clova_model');
let RPCModel = require('./rpc_model');
let Handler = require('../entity/handler/handler');
let Router = require('../entity/router/router');
let UnknownRouter = require('../entity/router/unknown-router');
let {intentTypes} = require('../entity/intent_types');

let self;

class AppModel {

    constructor(config = {alexa: {appId: 'unknown'}}) {
        self = this;
        self.apps = new Map();
        self.handlers = new Map();
        self.config = config;
        self.handlerUnknown = undefined;
        self.initHandlers();
        self.addApp('alexa', new AlexaModel(self.config.alexa.appId, self.appProcess));
        if(self.config.google) self.addApp('google', new GoogleModel(self.config.google.conversationalType, self.appProcess));
	
        self.addApp('clova', new ClovaModel(self.appProcess));
        self.addApp('rpc', new RPCModel(self.appProcess));
    }

    initHandlers() {
        for (let i = 0; i < Object.keys(intentTypes).length; i++) {
            let type = Object.keys(intentTypes)[i];
            self.handlers.set(intentTypes[type], new Map());
        }
    }

    /**
     *
     * @param handler {Handler}
     */
    setUnknownHandler(handler) {
        if (!(handler instanceof Handler)) throw 'Must be Handler';
        self.handlerUnknown = handler;
    }

    /**
     *
     * @param name {String}
     * @param app {Object}
     */
    addApp(name, app) {
        self.apps.set(name, app);
    }

    /**
     *
     * @param app {String}
     * @param data {Object}
     * @param options
     * @returns {Request}
     */
    getRequest(app, data, options) {
        let model = self.apps.get(app);
        return model.getRequest(data, options);
    }

    /**
     *
     * @param handler {Handler}
     */
    addHandler(handler) {
        //if ((Object.keys(intentTypes)).indexOf(handler.getType()) === -1) throw 'Type must be from: ' + Object.values(intentTypes).join(', ');
        if (!(handler instanceof Handler)) throw 'Must be Handler';
        let aliases = handler.getAliases();
        for (let i = 0; i < aliases.length; i++) {
            let aliasName = aliases[i];
            let h = self.handlers.get(handler.getType()).get(aliasName);
            if (h) return ;// throw 'Handler already exists ' + handler.getName() + ' for alias ' + aliasName;
            self.handlers.get(handler.getType()).set(aliasName, handler);
        }
    }

    /**
     *
     * @param type {String}
     * @param name {String}
     * returns {Handler}
     */
    getHandler(type, name) {
        console.log('h_type', type);
        console.log('h_name', name);
        //console.log('HANDLERS', self.handlers);
        let handler = self.handlers.get(type).get(name);
        if (!handler) {
            console.log(`NOT FOUND HANDLER ${type}-${name}`);
            handler = self.handlerUnknown;
        }
        return handler;
    }

    makeUnknownHandler() {
        let router = new UnknownRouter();
        return new Handler(intentTypes.TYPE_ERROR, 'Unknown', router);
    }

    /**
     *
     * @param request {Request}
     */
    appProcess(request) {
	//console.log('[appProcess]', request.getResponse().processResolve);
    
        if (!self.handlerUnknown) {
            self.handlerUnknown = self.makeUnknownHandler();
        }
        let name = request.getIntent().getName();
        let type = request.getIntent().getType();
        console.log(`PROCESS HANDLER ${type}-${name}`);
        let handler = self.getHandler(request.getIntent().getType(), request.getIntent().getName());
        self.processHandler(request, handler).then(() => {
	    //console.log('[AAAA]', request.getResponse().processResolve);
            request.getResponse().processResolve();
        }).catch((err) => {
            console.log('ERR', err);
            request.getResponse().processReject(err);
        });
    }

    /**
     *
     * @param app {string}
     * @param request {Request}
     */
    process(app, request) {
        return request.process(self);
    }

    /**
     *
     * @param request {Request}
     * @param handler {Handler}
     */
    processHandler(request, handler) {
        let p = new Promise((resolve, reject) => {
            return handler.getRouter().check(request).then((route) => {
                if (!route.ok) return self.processHandler(request, route.handler).then(() => {
                    resolve();
                }).catch((err) => {
                    resolve()
                });
                return handler.process(request).then(() => {
                    resolve();
                }).catch((err) => {
                    console.log(`[ERROR PROCESS HANDLER (${handler.getName()})-${handler.getType()}]`, err, err.stack);
                    resolve();
                });
            }).catch((err) => {
                console.log(`[ERROR PROCESS HANDLER ROUTER (${handler.getName()})-${handler.getType()}]`, err, err.stack);
                //TODO: call some error handler (but only when its not same handler)???
                resolve();
            });
        });
        return p;
    }

    setError(error) {
        this.error = error;
    }

    getError() {
        return this.error;
    }
}

module.exports = AppModel;