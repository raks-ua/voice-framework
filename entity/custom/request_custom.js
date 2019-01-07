'use strict';

const Request = require("../request");

class RequestCustom extends Request {


    constructor(data = '') {
        super(data);
        this.requestId = data.requestId;
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

}

module.exports = RequestCustom;
