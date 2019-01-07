'use strict';

const Request = require("../request");

class RequestClova extends Request {


    constructor(data = {}) {
        super(data);
        this.requestId = data.requestId;
        this.applicationId = data.applicationId;
    }

    /**
     *
     * @returns {string} applicationId
     */
    getApplicationId() {
        return this.applicationId;
    }

    /**
     *
     * @params {string} applicationId
     */
    setApplicationId(applicationId) {
        this.applicationId = applicationId;
    }

    /**
     *
     * @returns {string} requestId
     */
    getRequestId() {
        return this.requestId;
    }

    /**
     *
     * @param {string} requestId
     */
    setRequestId(requestId) {
        this.requestId = requestId;
    }

    process(appHandler) {
        try {
            //TODO: session attributes?
            appHandler.appProcess(this);
        } catch (err) {
            console.log('[ERR]', err);
            throw err;
        }
        return this.getResponse().process(appHandler, this);
    }
}

module.exports = RequestClova;
