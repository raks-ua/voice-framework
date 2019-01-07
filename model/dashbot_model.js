'use strict';

let config = require('config');
let Request = require('../entity/request');

class DashbotModel {
    constructor(config) {
        this.config = config;
    }

    getDashbot(app) {
        let dashbot;
        let dashKey = (this.config[app] && this.config[app] !== '') ? this.config[app] : '';
        let dashMeth = '';
        if (app === 'CLOVA' || app === 'GENERIC') {
            dashMeth = 'generic'
        } else {
            dashMeth = app.toLowerCase()
        }
        if (dashKey !== '') dashbot = require('dashbot')(dashKey)[dashMeth];
        console.log('dashbot', app.toLowerCase());
        if (!dashbot) console.log('[DASHBOT ERR]', `no key by app ${app}`, 'config:' + JSON.stringify(this.config));
        return dashbot;
    }

    /**
     *
     * @param app
     * @param data
     * @returns {Promise<any>}
     */
    logIncoming(app, data) {
        app = app.toUpperCase();
        let p = new Promise((resolve, reject) => {
            let dashbot = this.getDashbot(app);
            if (!dashbot) return reject('no dashbot');
            if (app === 'ALEXA' || app === 'GOOGLE') {
                let incomingLogging = dashbot.logIncoming(data.event, data.context);
                Promise.all([incomingLogging]).then(function (result) {
                    //console.log('[IN]', result, JSON.stringify(data));
                    resolve();
                }).catch(function (e) {
                    console.log('[DASHBOT ERR]', e);
                    reject(e);
                });
            } else {
                resolve();
            }
        });
        return p;
    }

    /**
     *
     * @param app
     * @param data
     * @returns {Promise<any>}
     */
    logOutgoing(app, data) {
        app = app.toUpperCase();
        let p = new Promise((resolve, reject) => {
            let dashbot = this.getDashbot(app);
            if (!dashbot) return reject('no dashbot');
            if (app === 'ALEXA' || app === 'GOOGLE') {
                let outgoingLogging = dashbot.logOutgoing(data.event, data.response);
                Promise.all([outgoingLogging]).then(function (result) {
                    //console.log('[OUT]', result, JSON.stringify(data));
                    resolve();
                }).catch(function (e) {
                    console.log('[DASHBOT ERR]', e);
                    reject(e);
                });
            } else {
                resolve();
            }
        });
        return p;
    }

    /**
     *
     * @param request
     * @returns {Promise<any>}
     */
    logIncomingByRequest(request) {
        let p = new Promise((resolve, reject) => {
            if (!request.getUser()) reject('No user');
            let name = request.constructor.name.substr(7).toUpperCase();
            let dashbot = this.getDashbot(name);
            if (!dashbot) return reject('no dashbot');
            if (name === 'ALEXA' || name === 'GOOGLE') {
                let incomingLogging = dashbot.logIncoming(request.event, request.context);
                Promise.all([incomingLogging]).then(function (result) {
                    //console.log('[IN]', result, JSON.stringify(data));
                    resolve();
                }).catch(function (e) {
                    console.log('[DASHBOT ERR]', e);
                    reject(e);
                });
            } else {
                let messageForDashbot = {
                    'text': request.getResponse().getMessage() ? request.getResponse().getMessage().getMessage() : '',
                    'userId': request.getUser().getUserId(),
                    'conversationId': request.getSession().getSessionId()
                };

                let incomingLogging = dashbot.logIncoming(messageForDashbot).generic;
                Promise.all([incomingLogging]).then(function (result) {
                    // console.log('[IN]', result, JSO);
                    resolve();
                }).catch(function (e) {
                    console.log('[DASHBOT ERR]', e);
                    reject(e);
                });
            }


        });
        return p;
    }

    /**
     *
     * @param request
     * @returns {Promise<any>}
     */
    logOutgoingByRequest(request) {
        let p = new Promise((resolve, reject) => {
            if (!request.getUser()) reject('No user');
            let name = request.constructor.name.substr(7).toUpperCase();
            let dashbot = this.getDashbot(name);
            if (!dashbot) return reject('no dashbot');
            if (name === 'ALEXA' || name === 'GOOGLE') {
                let outgoingLogging = dashbot.logOutgoing(request.event, request.context);
                Promise.all([outgoingLogging]).then(function (result) {
                    //console.log('[IN]', result, JSON.stringify(data));
                    resolve();
                }).catch(function (e) {
                    console.log('[DASHBOT ERR]', e);
                    reject(e);
                });
            } else {
                let messageForDashbot = {
                    'text': request.getResponse().getMessage() ? request.getResponse().getMessage().getMessage() : '',
                    'userId': request.getUser().getUserId(),
                    'conversationId': request.getSession().getSessionId()
                };

                let outgoingLogging = dashbot.logOutgoing(messageForDashbot).generic;
                Promise.all([outgoingLogging]).then(function (result) {
                    // console.log('[IN]', result, JSO);
                    resolve();
                }).catch(function (e) {
                    console.log('[DASHBOT ERR]', e);
                    reject(e);
                });
            }


        });
        return p;
    }
}

module.exports = DashbotModel;