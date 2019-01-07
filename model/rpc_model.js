'use strict';

let self;

let UserRPC = require('../entity/rpc/user_rpc.js');
let SessionRPC = require('../entity/rpc/session_rpc.js');
let IntentRPC = require('../entity/rpc/intent_rpc.js');
let RequestRPC = require('../entity/rpc/request_rpc.js');
let ResponseRPC = require('../entity/rpc/response_rpc.js');
let {intentTypes, intentSubTypes} = require('../entity/intent_types.js');

class RPCModel {

    constructor(processCallback) {
        self = this;
        this.processCallback = processCallback;
    }

    /**
     *
     * @param {Object} data
     * @param {Object} options
     * @returns {RequestRPC}
     */
    getRequest(data, options) {
        let requestRPC = new RequestRPC({data});
        let sessionRPC = new SessionRPC();
        let userRPC = new UserRPC();

        if(data.params) {
            if (data.params.sessionId) {
                this.initSession(data, sessionRPC);
                requestRPC.setSession(sessionRPC);
            }
        }
        this.initRequest(data, requestRPC);
        this.initResponse(data, options, requestRPC);
        this.initUser(data, userRPC);
        requestRPC.setUser(userRPC);
        return requestRPC;
    };


    /**
     *
     * @param {Object} event
     * @param {SessionRPC} sessionRPC
     * @returns {SessionRPC}
     */
    initSession(event, sessionRPC) {
        sessionRPC.setSessionId(event.params.sessionId);
        return SessionRPC;
    }

    /**
     *
     * @param {Object} event
     * @param {UserRPC} userRPC
     * @returns {UserRPC}
     */
    initUser(event, userRPC) {
        return userRPC;
    }

    /**
     *
     * @param {Object} event
     * @param {RequestRPC} requestRPC
     * @returns {RequestRPC}
     */
    initRequest(event, requestRPC) {
        requestRPC.setRequestId(event.requestId || 'unknown_request');
        requestRPC.setApplicationId('rpc');
        //requestRPC.setLang(getLang(event.request.locale));
        //requestRPC.setCountry(getCountry(event.request.locale));
        requestRPC = this.initIntent(event, requestRPC);
        return requestRPC;
    }

    initIntent(event, requestRPC) {
        let intentRPC = new IntentRPC({});
        let intentName = event.name || 'unknown';
        if (event.params) {
            intentRPC.setParameters(event.params);
        }
        intentRPC.setName(intentName);
        intentRPC.setType(this.getIntentType(intentName, 'API'));
        requestRPC.setIntent(intentRPC);
        return requestRPC;
    }

    getIntentType(name, type) {
        return intentTypes.TYPE_API;
    }

    /**
     *
     * @param data
     * @param options {Object}
     * @param requestRPC {RequestRPC}
     * @returns {*}
     */
    initResponse(data, options, requestRPC) {
        let responseRPC = new ResponseRPC({request: requestRPC});
        requestRPC.setResponse(responseRPC);
        requestRPC.getResponse().setResultCallback(options.callback);
        return requestRPC;
    }

}

function getCountry(locale) {
    let reg = /-(\w+)$/;
    let m = locale.match(reg);
    return m[1].toLowerCase();
}

function getLang(locale) {
    let reg = /^(\w+)-/;
    let m = locale.match(reg);
    return m[1].toLowerCase();
}


module.exports = RPCModel;