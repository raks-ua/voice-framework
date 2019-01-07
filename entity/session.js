'use strict';

class Session {


    /**
     * @param {Object} data
     */
    constructor(data = '') {
        this.sessionId = data.sessionId;
        this.params = {};
    }

    /**
     *
     * @returns {string} sessionId
     */
    getSessionId() {
        return this.sessionId;
    }

    /**
     *
     * @param {string} sessionId
     */
    setSessionId(sessionId) {
        this.sessionId = sessionId;
    }

    setParam(key, val) {
        this.params[key] = val;
        //console.log('[PARAMS]', this.params);
    }

    getParam(key) {
        return this.params[key];
    }

    getParams() {
        return this.params;
    }

    setParams(params){
        this.params = params;
    }
}
module.exports = Session;