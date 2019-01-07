'use strict';

let self;

let UserGoogle = require('../entity/google/user_google.js');
let SessionGoogle = require('../entity/google/session_google.js');
let IntentGoogle = require('../entity/google/intent_google.js');
let DataGoogle = require('../entity/google/data_google.js');
let RequestGoogle = require('../entity/google/request_google.js');
let ResponseGoogle = require('../entity/google/response_google.js');
let {intentTypes, intentSubTypes} = require('../entity/intent_types.js');

class GoogleModel {

    constructor(processCallback) {
        self = this;
        this.processCallback = processCallback;
    }

    /**
     *
     * @param {Object} data
     * @param {Object} options
     * @returns {RequestGoogle}
     */
    getRequest(data, options) {
        let requestGoogle = new RequestGoogle();
        let sessionGoogle = new SessionGoogle();
        let userGoogle = new UserGoogle();
        let dataGoogle = new DataGoogle();

        let version = 1;
        if (data.originalDetectIntentRequest) {
            version = parseInt(data.originalDetectIntentRequest.version);
        }

        if (version === 1) {

            this.initSession(data, sessionGoogle);
            this.initUser(data, userGoogle);
            this.initRequest(data, requestGoogle);
            if (data.result.contexts) {
                this.initData(data, dataGoogle);
                requestGoogle.setData(dataGoogle);
            }

        } else if (version === 2) {
            this.initSessionV2(data, sessionGoogle);
            this.initUserV2(data, userGoogle);
            this.initRequestV2(data, requestGoogle);
            if (data.result && data.result.contexts) {
                this.initData(data, dataGoogle);
                requestGoogle.setData(dataGoogle);
            }
        }
        requestGoogle.setSession(sessionGoogle);
        requestGoogle.setUser(userGoogle);

        this.initResponse(data, options, requestGoogle);
        //console.log(requestGoogle);
        return requestGoogle;
    };


    /**
     *
     * @param {Object} data
     * @param {SessionGoogle} sessionGoogle
     * @returns {SessionGoogle}
     */
    initSession(data, sessionGoogle) {


        //sessionGoogle.setSessionId(data.originalRequest.source + '.' + data.sessionId + '.' + data.originalRequest.data.user.userId);
        if (data.sessionId  && data.originalRequest) {
            sessionGoogle.setSessionId(data.originalRequest.source + '.' + data.sessionId + '.' + data.originalRequest.data.user.userId);
            sessionGoogle.setNew(data.originalRequest.data.conversation.type);
        }
        return sessionGoogle;
    }

    /**
     *
     * @param {Object} data
     * @param {SessionGoogle} sessionGoogle
     * @returns {SessionGoogle}
     */
    initSessionV2(data, sessionGoogle) {
        if (data.originalDetectIntentRequest) {
            sessionGoogle.setSessionId(data.originalDetectIntentRequest.payload.conversation.conversationId + '.' + data.originalDetectIntentRequest.payload.user.userId);
            sessionGoogle.setNew(data.originalDetectIntentRequest.payload.conversation.type);
        }
        return sessionGoogle;
    }

    /**
     *
     * @param {Object} data
     * @param {DataGoogle} dataGoogle
     * @returns {DataGoogle}
     */
    initData(data, dataGoogle) {
        dataGoogle.setContext(data.result.contexts);
        return dataGoogle;
    }

    /**
     *
     * @param {Object} data
     * @param {UserGoogle} userGoogle
     * @returns {UserGoogle}
     */
    initUser(data, userGoogle) {
        if (data.originalRequest && data.originalRequest.data.user.userId) {
            userGoogle.setUserId(data.originalRequest.data.user.userId);
        }
        return userGoogle;
    }

    /**
     *
     * @param {Object} data
     * @param {UserGoogle} userGoogle
     * @returns {UserGoogle}
     */
    initUserV2(data, userGoogle) {
        if (data.originalDetectIntentRequest && data.originalDetectIntentRequest.payload.user.userId) {
            userGoogle.setUserId(data.originalDetectIntentRequest.payload.user.userId);
        }
        return userGoogle;
    }

    /**
     *
     * @param {Object} data
     * @param {RequestGoogle} requestGoogle
     * @returns {RequestGoogle}
     */
    initRequest(data, requestGoogle) {
        if (data.originalRequest) {
            requestGoogle.setRequestId(data.id);
            requestGoogle.setLang(getLang(data.originalRequest.data.user.locale));
            requestGoogle.setCountry(getCountry(data.originalRequest.data.user.locale));

            let intentGoogle = new IntentGoogle();
            intentGoogle.setParameters(data.result.parameters);
            intentGoogle.setName(data.result.metadata.intentName);
            intentGoogle.setType(intentTypes.TYPE_SPEECH);
            requestGoogle.setIntent(intentGoogle);
        }
        return requestGoogle;
    }

    /**
     *
     * @param {Object} data
     * @param {RequestGoogle} requestGoogle
     * @returns {RequestGoogle}
     */
    initRequestV2(data, requestGoogle) {
        if (data.originalDetectIntentRequest) {
            requestGoogle.setRequestId(data.responseId);
            requestGoogle.setLang(getLang(data.queryResult.languageCode));
            requestGoogle.setCountry(getCountry(data.queryResult.languageCode));

            let intentGoogle = new IntentGoogle();
            intentGoogle.setParameters(data.queryResult.parameters);
            intentGoogle.setName(data.queryResult.intent.displayName);
            intentGoogle.setType(intentTypes.TYPE_SPEECH);
            this.initQueryText(data, intentGoogle);
            requestGoogle.setIntent(intentGoogle);
            if(data.originalDetectIntentRequest && data.originalDetectIntentRequest.payload && data.originalDetectIntentRequest.payload.surface)
                requestGoogle.setSurfaces(data.originalDetectIntentRequest.payload.surface.capabilities);
        }
        return requestGoogle;
    }

    initQueryText(data, intentGoogle){
        if(data.queryResult.queryText !== 'actions_intent_OPTION'){
            intentGoogle.setQueryText(data.queryResult.queryText);
        }else{
            let inputs = data.originalDetectIntentRequest.payload.inputs;
            for(let i = 0; i < inputs.length; i++){
                if(!inputs[i].arguments) continue;
                for(let k = 0; inputs[i].arguments.length; k++){
                    if(inputs[i].arguments[k].name !== 'OPTION') continue;
                    intentGoogle.setQueryText(inputs[i].arguments[k].textValue);
                    return intentGoogle;
                }
            }
        }
        return intentGoogle;
    }

    /**
     *
     * @param data
     * @param options {Object}
     * @param requestGoogle {RequestGoogle}
     * @returns {ResponseGoogle}
     */
    initResponse(data, options, requestGoogle) {
        let responseGoogle = new ResponseGoogle({request: requestGoogle});
        requestGoogle.setResponse(responseGoogle);
        requestGoogle.getResponse().setResultCallback(options.callback);
        return requestGoogle;
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

module.exports = GoogleModel;