'use strict';

let self;

const config = require('config');

let alexaEvent = require('./../app/alexa_event');
/**
 *
 * @type {Wap3LibSQL}
 */
let sql = require('../lib/sql.js');

let GoogleActionsModel = function () {
    self = this;
};

/**
 *
 * @param type
 * @param body
 * @param callback
 */
GoogleActionsModel.prototype.makeAlexaIntent = function (type, body, callback) {
    let result = body.result || {};
    let contexts = result.contexts || [];
    let status = body.status;
    if(!status || status.code !== 200){
        let intent = {
            name: 'Error.Google',
            slots: {}
        };
        return callback && callback(undefined, intent);
    }

    let intent = {
        name: result.metadata.intentName,
        slots: {}
    };
    let keys = Object.keys(result.parameters);
    for (let i = 0; i < keys.length; i++) {
        let name = keys[i];
        if(result.parameters[name] === '') continue;
        intent.slots[name] = {
            "name": name,
            "value": result.parameters[name]
        }
    }

    for (let i = 0; i < contexts.length; i++) {
        if(!contexts[i].parameters || contexts[i].parameters.length === 0) continue;

        let keys = Object.keys(contexts[i].parameters);
        for (let k = 0; k < keys.length; k++) {
            let name = keys[k];
            if(intent.slots[name] || contexts[i].parameters[name] === '') continue;
            let val = contexts[i].parameters[name];
            if(Array.isArray(val) === true){
                val = val.join(' ');
            }
            intent.slots[name] = {
                "name": name,
                "value": val
            }
        }
    }

    callback && callback(undefined, intent);
};

/**
 * Type - IntentRequest or LaunchRequest
 * @param {String} type
 * @param {String} body
 * @param callback
 */
GoogleActionsModel.prototype.makeAlexaEvent = function (type, body, callback) {
    self.makeAlexaIntent(type, body, function(err, intent){
        if(err) return callback && callback(err);
        let originalRequest = body.originalRequest;
        let source = originalRequest.source;
        let userId = source + '.' + originalRequest.data.user.userId;
        console.log('USER ID', userId);
        let sessionId = source + '.' + body.sessionId + '.' + userId;
        console.log('SESSION ID', sessionId);
        let event = alexaEvent.create();
        //SESSION
        event.session.application.applicationId = config.APP_ID;
        event.session.user.userId = userId;
        event.session.sessionId = sessionId;

        //CONTEXT
        event.context.System.application.applicationId = config.APP_ID;
        event.context.System.user.userId = userId;

        //REQUEST
        event.request.type = type;
        event.request.timestamp = (new Date()).toDateString();
        event.request.locale = originalRequest.data.user.locale;

        if (type === 'LaunchRequest') {
            delete event.request.intent;
            return callback && callback(undefined, event);
        } else {
            event.request.intent = intent;
        }
        callback && callback(undefined, event);
    });
};

/**
 *
 * @returns {{succeed: succeed, fail: fail}}
 */
GoogleActionsModel.prototype.makeAlexaContext = function (callback) {
    let context = {
        succeed: function (data) {
            console.log('CONTEXT.SUCCEED', data);
            callback && callback(undefined, data);
        },
        fail: function (error) {
            console.log('CONTEXT.FAIL', error);
            callback && callback(error);
        }

    };
    return context;
};

module.exports = new GoogleActionsModel();