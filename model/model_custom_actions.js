'use strict';

let self;

const config = require('config');

let alexaEvent = require('./../app/alexa_event');
/**
 *
 * @type {Wap3LibSQL}
 */
let sql = require('../lib/sql.js');

let CustomActionsModel = function () {
    self = this;
};

/**
 *
 * @param type
 * @param params {Object}
 * @param callback
 */
CustomActionsModel.prototype.makeAlexaIntent = function (type, params, callback) {

    let intent = {
        name: 'CustomIntent',
        slots: {}
    };

    let keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        let name = keys[i];
        if(params[name] === '') continue;
        intent.slots[name] = {
            "name": name,
            "value": params[name]
        }
    }

    if(params.coin){
        intent.name = 'CurrencyIntent';
        intent.slots['currency'] = {
            "name": 'currency',
            "value": params.coin
        }
    }

    callback && callback(undefined, intent);
};

/**
 * Type - IntentRequest or LaunchRequest
 * @param {String} type
 * @param {Object} params
 * @param callback
 */
CustomActionsModel.prototype.makeAlexaEvent = function (type, params, callback) {
    self.makeAlexaIntent(type, params, function(err, intent){
        if(err) return callback && callback(err);
        let source = 'custom';
        let userId = source + '.' + 'custom';
        console.log('USER ID', userId);
        let sessionId = source + '.' + 'custom' + '.' + userId;
        console.log('SESSION ID', sessionId);
        let event = alexaEvent.create();
        //SESSION
        event.session.application.applicationId = config.APP_ID;
        event.session.user.userId = userId;
        event.session.sessionId = sessionId;
        event.session.attributes.caller = 'custom';

        //CONTEXT
        event.context.System.application.applicationId = config.APP_ID;
        event.context.System.user.userId = userId;

        //REQUEST
        event.request.type = type;
        event.request.timestamp = (new Date()).toDateString();
        event.request.locale = 'en-US';

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
CustomActionsModel.prototype.makeAlexaContext = function (callback) {
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

module.exports = new CustomActionsModel();