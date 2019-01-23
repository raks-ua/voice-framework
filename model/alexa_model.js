'use strict';

//https://www.npmjs.com/package/alexa-sdk
let self;
let RequestAlexa = require('../entity/alexa/request_alexa');
let ResponseAlexa = require('../entity/alexa/response_alexa');
let UserAlexa = require('../entity/alexa/user_alexa.js');
let SessionAlexa = require('../entity/alexa/session_alexa.js');
let IntentAlexa = require('../entity/alexa/intent_alexa.js');
let DataAlexa = require('../entity/alexa/data_alexa.js');
let {intentTypes, intentSubTypes} = require('../entity/intent_types.js');

const Alexa = require('alexa-sdk');

class AlexaModel {

    constructor(appId, processCallback) {
        self = this;
        this.appId = appId;
        this.processCallback = processCallback;
    }

    /**
     *
     * @param data {Object}
     * @param options {Object}
     * @returns {RequestAlexa}
     */
    getRequest(data, options) {
        let requestAlexa = new RequestAlexa();
        let sessionAlexa = new SessionAlexa();
        let userAlexa = new UserAlexa();
        let dataAlexa = new DataAlexa();


        if (data.session) {
            this.initSession(data, sessionAlexa);
            requestAlexa.setSession(sessionAlexa);

            if (data.session.user) {
                this.initUser(data, userAlexa);
                requestAlexa.setUser(userAlexa);
            }
        }

        if (data.context) {
            this.initData(data, dataAlexa);
            requestAlexa.setData(dataAlexa);
        }

        if (data.request) {
            this.initRequest(data, requestAlexa)
        }

        this.initResponse(data, options, requestAlexa);
        return requestAlexa;
    };

    /**
     *
     * @param {Object} event
     * @param {SessionAlexa} sessionAlexa
     * @returns {SessionAlexa}
     */
    initSession(event, sessionAlexa) {
        sessionAlexa.setSessionId(event.session.sessionId);
        sessionAlexa.setNew(event.session.new);
        return SessionAlexa;
    }

    /**
     *
     * @param {Object} event
     * @param {UserAlexa} userAlexa
     * @returns {UserAlexa}
     */
    initUser(event, userAlexa) {
        userAlexa.setAccessToken(event.session.user.accessToken);
        userAlexa.setUserId(event.session.user.userId);
        return UserAlexa;

    }

    /**
     *
     * @param {Object} data
     * @param {DataAlexa} dataAlexa
     * @returns {DataAlexa}
     */
    initData(data, dataAlexa) {
        dataAlexa.setContext(data.context);
        return dataAlexa;

    };


    /**
     *
     * @param {Object} event
     * @param {RequestAlexa} requestAlexa
     * @returns {RequestAlexa}
     */
    initRequest(event, requestAlexa) {
        if (event.request.type.indexOf('LaunchRequest') !== -1) {
            requestAlexa.setRequestId(event.request.requestId);
            requestAlexa.setApplicationId(event.session.application.applicationId);
        }

        requestAlexa.setLang(getLang(event.request.locale));
        requestAlexa.setCountry(getCountry(event.request.locale));
        requestAlexa = this.initIntent(event, requestAlexa);
        return requestAlexa;
    }

    initIntent(event, requestAlexa) {
        let intentAlexa = new IntentAlexa();
        let intentName = event.request.intent ? event.request.intent.name : event.request.type;
        if (event.request.type.indexOf('LaunchRequest') !== -1) {
            intentAlexa.setName('LaunchRequest');
        }
        if (event.request.intent) {
            intentAlexa.setSlots(event.request.intent.slots);
        }
        let m;
        if (m = event.request.type.match(/^AudioPlayer.(.*)/)) {
            intentAlexa.setName(m[1]);
        }else if (m = event.request.type.match(/^PlaybackController.(.*)/)) {
            intentAlexa.setName(m[1]);
        }else{
            intentAlexa.setName(intentName);
        }
        intentAlexa.setType(this.getIntentType(intentName, event.request.type));
        requestAlexa.setIntent(intentAlexa);
        return requestAlexa;
    }

    getIntentType(name, type) {
        if (name === 'LaunchRequest') return intentTypes.TYPE_SPEECH;
        if (type === 'IntentRequest') return intentTypes.TYPE_SPEECH;
        if (name === 'System.ExceptionEncountered') return intentTypes.TYPE_ERROR;
        if(name.match(/^AudioPlayer./)){
            return intentTypes.TYPE_AUDIO;
        }

        if(name.match(/^PlaybackController./)){
            return intentTypes.TYPE_BUTTON;
        }
        return 'speech';
    }

    /**
     *
     * @param data
     * @param options {Object}
     * @param requestAlexa {RequestAlexa}
     * @returns {*}
     */
    initResponse(data, options, requestAlexa) {
        try {
            const alexa = Alexa.handler(data, options.context, options.callback);
            alexa.appId = this.appId;
            alexa.registerHandlers({
                'Unhandled': function () {
                    requestAlexa.getResponse().setResponseBuilder(this.response);
                    if(requestAlexa.getSession()) requestAlexa.getSession().setAttributes(this.attributes);
                    self.processCallback(requestAlexa);
                }
            });
            let responseAlexa = new ResponseAlexa({alexa: alexa, request: requestAlexa});
            requestAlexa.setResponse(responseAlexa);
        } catch (err) {
            console.log('[ERR]', err);
            throw err;
        }
        return requestAlexa;
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

module.exports = AlexaModel;