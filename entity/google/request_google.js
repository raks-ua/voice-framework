'use strict';

const Request = require("../request");
const ResponseGoogle = require("./response_google");

class RequestGoogle extends Request {
    constructor(data = {}) {
        super(data);
        this.requestId = data.requestId;
        this.surfaces = [];
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

    setSurfaces(surfaces) {
        //console.log('[SURFACES]', surfaces);
        this.surfaces = surfaces;
    }

    hasDisplay() {
        let hasDisplay = false;
        for (let i = 0; i < this.surfaces.length; i++) {
            if (this.surfaces[i].name !== 'actions.capability.SCREEN_OUTPUT') continue;
            hasDisplay = true;
        }
        return hasDisplay;
    }
}

module.exports = RequestGoogle;