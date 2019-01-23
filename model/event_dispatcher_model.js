'use strict';
let Event = require('../entity/event_dispatcher/event');
let InitEvent = require('../entity/event_dispatcher/init_event');
let BeforeRequestEvent = require('../entity/event_dispatcher/before_request_event');
let RequestEvent = require('../entity/event_dispatcher/request_event');
let AfterRequestEvent = require('../entity/event_dispatcher/after_request_event');
let EndEvent = require('../entity/event_dispatcher/end_event');
let ErrorEvent = require('../entity/event_dispatcher/error_event');

if (!('toJSON' in Error.prototype))
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            let alt = {};
            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });


let self;

class EventDispatcherHandler {

    /**
     *
     * @param dispatcher {EventDispatcher}
     */
    constructor(dispatcher) {
        this.chain = [];
        this.stopped = false;
        this.error = undefined;
        this.dispatcher = dispatcher;
    }

    /**
     *
     * @param event {Event}
     * @param data
     */
    addChain(event, data) {
        let e = Object.assign({}, event);
        e.getName = event.getName;
        e.getData = event.getData;
        this.chain.push({
            call: () => {
                //console.log(event);
                return this.dispatcher.send(e)
            },
            event: e
        });
    }

    assign(target, ...sources) {
        sources.forEach(source => {
            Object.defineProperties(target, Object.keys(source).reduce((descriptors, key) => {
                //console.log('[PROP]', key, source);
                descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
                return descriptors;
            }, {}));
        });
        return target;
    }

    getChain() {
        return this.chain;
    }

    mergeChain(chain) {
        this.chain = this.chain.concat(chain);
    }

    process() {
        //console.log(this.chain);
        this.processChain(0);
    }

    processChain(index) {
        let chain = this.chain[index];
        chain.call().catch((err) => {
            throw {err, event: chain.event};
        }).then(() => {
            if (this.stopped) throw {err: this.error, event: chain.event};
            if(this.chain.length > index + 1) this.processChain(index + 1);
        }).catch((err) => {
            //console.log('[processChain err]', err);
            this.dispatcher.handleRequestError(err).then(() => {
                if(this.chain.length > index + 1) this.processChain(index + 1);
            });
        });
    }

    stop(err) {
        this.stopped = true;
        this.stoppedError = err;
    }
}

class EventDispatcher {

    constructor() {
        self = this;
        this.handlers = new Map();
    }

    /**
     *
     * @param event {Event}
     * @param callback {Function}
     */
    send(event, callback) {
        let p = new Promise((resolve, reject) => {
            let handlers = this.getHandlersByEvent(event.getName());
            let priorities = [];
            handlers.forEach((callbacks, priority) => {
                priorities.push({priority, callbacks});
            });

            priorities = priorities.sort((a, b) => {
                if (a.priority < b.priority) {
                    return -1;
                }
                if (a.priority > b.priority) {
                    return 1;
                }
                return 0;
            });
            this.processCallbacks(priorities, 0, event, (err) => {
                if (err) {
                    callback && callback(err, event);
                    return reject(err);
                }
                callback && callback(undefined, event);
                resolve(event.getData());
            });
        });
        return p;
    }

    /**
     *
     * @param app {String} alexa, google...
     * @param data {Object}
     * @returns {EventDispatcherHandler}
     */
    handleAppRequest(app, data) {
        let handler = new EventDispatcherHandler(this);
        data = data || {};
        data.app = app;
        let event = new InitEvent(data);
        handler.addChain(event);
        let handlerRequest = this.handleRequest(app, data);
        handler.mergeChain(handlerRequest.getChain());
        event = new EndEvent(data);
        handler.addChain(event);
        return handler;
    }

    /**
     *
     * @param app {String} alexa, google...
     * @param data {Object}
     * @returns {EventDispatcherHandler}
     */
    handleInitRequest(data = {}) {
        let handler = new EventDispatcherHandler(this);
        let event = new InitEvent(data);
        handler.addChain(event);
        return handler;
    }

    /**
     *
     * @param app {String}
     * @param data {Object}
     * @returns {EventDispatcherHandler}
     */
    handleRequest(app, data) {
        data = data || {};
        data.app = app;
        let handler = new EventDispatcherHandler(this);
        let event = new BeforeRequestEvent(data);
        handler.addChain(event);
        event = new RequestEvent(data);
        handler.addChain(event);
        event = new AfterRequestEvent(data);
        handler.addChain(event);
        return handler;
    }

    handleRequestError(err) {
        let event = new ErrorEvent(err);
        return this.send(event).catch((errFinal) => {
            console.log('[ERR handleRequestError][NOT HANDLED!]', errFinal);
            return errFinal;
        });
    }

    /**
     *
     * @param event
     * @param context
     * @param callback
     */
    handleAlexaAppRequest(event, context, callback) {
        let handlerError;
        let h;
        let appCallback = (error, data) => {
//	    console.trace();
//            console.log('[RES]', callback, error);
            if (error) {
                return h.stop(error);
            }
            if (handlerError) error = handlerError;

//            console.log('[RES]', callback, error, data);

//	    console.log('[RES2]', callback);

            callback(error, data);
        };
        h = this.handleAppRequest('alexa', {
            appContext: context,
            appEvent: event,
            appCallback
        });
        handlerError = h.error;
        h.process();
    }

    /**
     *
     * @param app
     * @param event
     * @param callback
     */
    handleServerAppRequest(app, event, callback) {
        let handlerError;
        let h;
        let appCallback = (error, data) => {
            if (error) {
                return h.stop(error);
            }
            if (handlerError) error = handlerError;
            callback(error, data);
        };
        h = this.handleRequest(app, {
            appEvent: event,
            appCallback
        });
        handlerError = h.error;
        h.process();
    }

    /**
     *
     * @param callback
     */
    handleServerInitRequest(callback) {
        let handlerError;
        let h;
        let appCallback = (error, data) => {
            if (error) {
                return h.stop(error);
            }
            if (handlerError) error = handlerError;
            callback(error, data);
        };
        h = this.handleInitRequest();
        handlerError = h.error;
        h.process();
    }

    /**
     *
     * @param name
     * @param callback {Function}
     * @param priority {Number} 1 - max
     */
    add(name, callback, priority = 5) {
        let handlers = this.getHandlersByPriority(name, priority);
        handlers.push(callback);
    }

    /**
     *
     * @param name {String}
     * @returns {Map}
     */
    getHandlersByEvent(name) {
        let handlers = this.handlers.get(name);
        if (!handlers) {
            this.handlers.set(name, new Map());
            handlers = this.handlers.get(name);
        }
        return handlers;
    }

    /**
     *
     * @param name
     * @param priority
     * @returns {any}
     */
    getHandlersByPriority(name, priority) {
        let handlers = this.getHandlersByEvent(name);
        let handlersByPriority = handlers.get(priority);
        if (!handlersByPriority) {
            handlers.set(priority, []);
            handlersByPriority = handlers.get(priority);
        }
        return handlersByPriority;
    }

    /**
     *
     * @param priorities {Array}
     * @param index {Number}
     * @param event {Event}
     * @param callback {Function}
     */
    processCallbacks(priorities, index, event, callback) {
        //console.log('[priorities]',JSON.stringify({priorities, event}));
        let p = [];
        for (let i = 0; i < priorities[index].callbacks.length; i++) {
            p.push(new Promise((resolve, reject) => {
                let currentCallback = priorities[index].callbacks[i];
                currentCallback(event, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            }));
        }
        Promise.all(p).then(() => {
            let nextIndex = index + 1;
            if (priorities.length === nextIndex) return callback && callback();
            this.processCallbacks(priorities, nextIndex, event, callback);
        }).catch((err) => {
            console.log('[ERR]', err, err.stack);
            callback && callback(err);
        });
    }
}

module.exports = new EventDispatcher();