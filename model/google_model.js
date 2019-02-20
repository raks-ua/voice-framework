'use strict';


let UserGoogle = require('../entity/google/user_google.js');
let SessionGoogle = require('../entity/google/session_google.js');
let IntentGoogle = require('../entity/google/intent_google.js');
let DataGoogle = require('../entity/google/data_google.js');
let RequestGoogle = require('../entity/google/request_google.js');
let ResponseGoogle = require('../entity/google/response_google.js');
let {intentTypes, intentSubTypes} = require('../entity/intent_types.js');
let self;
const {
    dialogflow,
    actionssdk
} = require('actions-on-google');

//https://developers.google.com/actions/reference/nodejsv2/overview

class GoogleModel {

    constructor(conversationalType, processCallback) {
        this.processCallback = processCallback;
	if(['dialogflow', 'actionssdk'].indexOf(conversationalType) === -1) throw 'Allowed only conversationalType \'dialogflow\', \'actionssdk\'';
	this.app;
	self = this;
	switch (conversationalType) {
	    case "dialogflow":
		this.app = dialogflow({debug: true});
	    break;
	    case "actionssdk":
		this.app = actionssdk({debug: true});
	    break;
	}
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


        this.initSession(data, sessionGoogle);
        this.initUser(data, userGoogle);
        this.initRequest(data, requestGoogle);
        if (data.result && data.result.contexts) {
            this.initData(data, dataGoogle);
            requestGoogle.setData(dataGoogle);
        }

        requestGoogle.setSession(sessionGoogle);
        requestGoogle.setUser(userGoogle);

        this.initResponse(data, options, requestGoogle);
        return requestGoogle;
    };


    /**
     *
     * @param {Object} data
     * @param {SessionGoogle} sessionGoogle
     * @returns {SessionGoogle}
     */
    initSession(data, sessionGoogle) {
        if (data.originalDetectIntentRequest) {
            sessionGoogle.setSessionId(data.originalDetectIntentRequest.payload.conversation.conversationId + '.' + data.originalDetectIntentRequest.payload.user.userId);
	    sessionGoogle.setConversationId(data.originalDetectIntentRequest.payload.conversation.conversationId);
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
        if (data.originalDetectIntentRequest && data.originalDetectIntentRequest.payload.user.userId) {
            userGoogle.setUserId(data.originalDetectIntentRequest.payload.user.userId);
	    userGoogle.setPackageEntitlements(data.originalDetectIntentRequest.payload.user.packageEntitlements);
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
        if (data.originalDetectIntentRequest) {
            requestGoogle.setRequestId(data.responseId);
            requestGoogle.setLang(getLang(data.queryResult.languageCode));
            requestGoogle.setCountry(getCountry(data.queryResult.languageCode));

            let intentGoogle = new IntentGoogle();
            intentGoogle.setParameters(data.queryResult.parameters);
            if(data.originalDetectIntentRequest && data.originalDetectIntentRequest.payload && data.originalDetectIntentRequest.payload.inputs) 
		intentGoogle.setArguments(data.originalDetectIntentRequest.payload.inputs);

            intentGoogle.setName(data.queryResult.intent.displayName);
	    let mActions = data.queryResult.intent.displayName.match(/^actions\.intent\.(.*)/);
	    let mDialog = data.queryResult.intent.displayName.match(/^actions\_intent\_(.*)/);
    	    intentGoogle.setType(intentTypes.TYPE_SPEECH);

	    if(mActions){
        	intentGoogle.setType(intentTypes.TYPE_GOOGLE);
        	intentGoogle.setName(mActions[1]);
	    }else if(mDialog){
        	intentGoogle.setType(intentTypes.TYPE_GOOGLE);
        	intentGoogle.setName(mDialog[1]);
	    }
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
//	console.log('[options]', options);
	let responseGoogle;

	this.app.fallback((conv, params, option) => {
	    return new Promise((resolve, reject) => {
		//console.log('[ARGUMENTS]', conv.arguments, params);
		//requestGoogle.getIntent().setArguments(conv.arguments);
		//requestGoogle.getIntent().setParameters(params);
		//requestGoogle.getIntent().setOption(option);
		responseGoogle.setCb(resolve);
		responseGoogle.setConv({conv, params, option});
		//self.processCallback(requestGoogle);
	    });
	});

	responseGoogle = new ResponseGoogle({request: requestGoogle, app: this.app, cc: () => {
	    requestGoogle.getResponse().app(options.request, options.response);
	}});
	requestGoogle.setResponse(responseGoogle);
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