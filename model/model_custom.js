'use strict';

let self;

let UserCustom = require('../entity/custom/user_custom.js');
let SessionCustom = require('../entity/custom/session_custom.js');
let IntentCustom = require('../entity/custom/intent_custom.js');
let DataCustom = require('../entity/custom/data_custom.js');


let CustomModel = function () {
    self = this;
};

/**
 *
 * @param sessionId
 * @param type
 * @param {RequestCustom} requestCustom
 * @returns {RequestCustom}
 */
CustomModel.prototype.getRequestCustom = function (sessionId, type, requestCustom) {
    let sessionCustom = new SessionCustom();
    let userCustom = new UserCustom();
    let intentCustom = new IntentCustom();


    let isNew = true;
    let locale = 'en-US';

    sessionCustom.setSessionId('custom.' + sessionId);
    sessionCustom.setNew(isNew);
    requestCustom.setSession(sessionCustom);


    requestCustom.setRequestId('custom.request' + sessionId);
    requestCustom.setLang(getLang(locale));
    requestCustom.setCountry(getCountry(locale));
    requestCustom.setSession(sessionCustom);

    intentCustom.setSlots();
    intentCustom.setType(type);
    requestCustom.setIntent(intentCustom);

    userCustom.setUserId('custom.user' + sessionId);
    requestCustom.setUser(userCustom);
    return requestCustom;
};


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

module.exports = new CustomModel();