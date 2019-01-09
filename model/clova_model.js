'use strict';

let self;

let UserClova = require('../entity/clova/user_clova.js');
let SessionClova = require('../entity/clova/session_clova.js');
let IntentClova = require('../entity/clova/intent_clova.js');
let DataClova = require('../entity/clova/data_clova.js');
let RequestClova = require('../entity/clova/request_clova.js');
let ResponseClova = require('../entity/clova/response_clova.js');
let DeviceClova = require('../entity/clova/device_clova.js');
let {intentTypes, intentSubTypes} = require('../entity/intent_types.js');
let config = require('config');

class ClovaModel {

    constructor(processCallback) {
        self = this;
        this.processCallback = processCallback;
    }

    /**
     *
     * @param {Object} data
     * @param {Object} options
     * @returns {RequestClova}
     */
    getRequest(data, options) {
        let requestClova = new RequestClova();
        let sessionClova = new SessionClova();
        let userClova = new UserClova();
        let dataClova = new DataClova();

        if (data.session) {
            this.initSession(data, sessionClova);
            requestClova.setSession(sessionClova);

            if (data.session.user) {
                this.initUser(data, userClova);
                requestClova.setUser(userClova);
            }
        }

        if (data.context) {
            this.initData(data, dataClova);
            requestClova.setData(dataClova);
        }

        if (data.request) {
            this.initRequest(data, requestClova)
        }

        this.initResponse(data, options, requestClova);

        this.initDevice(data, requestClova);
        return requestClova;
    };


    /**
     *
     * @param {Object} event
     * @param {SessionClova} sessionClova
     * @returns {SessionClova}
     */
    initSession(event, sessionClova) {
        sessionClova.setSessionId(event.session.sessionId);
        sessionClova.setNew(event.session.new);
        return SessionClova;
    }

    /**
     *
     * @param {Object} event
     * @param {UserClova} userClova
     * @returns {UserClova}
     */
    initUser(event, userClova) {
        userClova.setAccessToken(event.session.user.accessToken);
        userClova.setUserId(event.session.user.userId);
        return userClova;

    }

    /**
     *
     * @param {Object} data
     * @param {DataClova} dataClova
     * @returns {DataClova}
     */
    initData(data, dataClova) {
        dataClova.setContext(data.context);
        return dataClova;

    };

    /**
     *
     * @param {Object} event
     * @param {RequestClova} requestClova
     * @returns {RequestClova}
     */
    initRequest(event, requestClova) {
        if (event.request.type.indexOf('LaunchRequest') !== -1) {
            requestClova.setRequestId(event.request.requestId);
        }

        requestClova.setApplicationId(event.request.extensionId);
        requestClova.setLang(getLang(event.request.locale));
        requestClova.setCountry(getCountry(event.request.locale));
        requestClova = this.initIntent(event, requestClova);
        return requestClova;
    }

    initIntent(event, requestClova) {
        let intentClova = new IntentClova();
        let intentName = event.request.intent ? event.request.intent.name : event.request.type;
        if(intentName === '') intentName = event.request.type;
        if (event.request.type.indexOf('LaunchRequest') !== -1) {
            intentClova.setName('LaunchRequest');
        }
        if (event.request.intent) {
            intentClova.setSlots(event.request.intent.slots);
        }
        let m;
        if (m = event.request.type.indexOf('EventRequest') !== -1) {
            if(event.request.event.namespace === 'AudioPlayer'){
                intentClova.setName(event.request.event.name);
                intentClova.setType(intentTypes.TYPE_AUDIO);
            }
            if(event.request.event.namespace === 'TemplateRuntime'){
                intentClova.setName(event.request.event.name);
                intentClova.setType(intentTypes.TYPE_AUDIO);
            }

        }else if (m = event.request.type.match(/^PlaybackController.(.*)/)) {
            intentClova.setName(m[1]);
            intentClova.setType(this.getIntentType(intentName, event.request.type));
        }else{
            intentClova.setName(intentName);
            intentClova.setType(this.getIntentType(intentName, event.request.type));
        }
        requestClova.setIntent(intentClova);
        return requestClova;
    }

    getIntentType(name, type) {
        if (name === 'LaunchRequest') return intentTypes.TYPE_SPEECH;
        if (type === 'IntentRequest') return intentTypes.TYPE_SPEECH;
        if (name === 'System.ExceptionEncountered') return intentTypes.TYPE_ERROR;
        if(name.match(/^PlaybackController./)){
            return intentTypes.TYPE_BUTTON;
        }
        return intentTypes.TYPE_SPEECH;
    }

    /**
     *
     * @param data
     * @param options {Object}
     * @param requestClova {RequestClova}
     * @returns {*}
     */
    initResponse(data, options, requestClova) {
        let responseClova = new ResponseClova({request: requestClova});
        requestClova.setResponse(responseClova);
        requestClova.getResponse().setResultCallback(options.callback);
        return requestClova;
    }

    /**
     *
     * @param data
     * @param requestClova {RequestClova}
     */
    initDevice(data, requestClova) {
        let deviceClova = new DeviceClova(data.context.System.device);
        requestClova.setDevice(deviceClova);
        return requestClova;
    }
}


function getCountry(locale) {
    return config.CLOVA.COUNTRY;
}

function getLang(locale) {
    return config.CLOVA.LANG;
}

module.exports = ClovaModel;