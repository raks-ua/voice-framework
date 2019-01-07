'use strict';

const Intent = require("../intent");

class IntentRPC extends Intent {

    /**
     *
     * @param {Object} data
     */
    constructor(data) {
        super(data);
        if (data.params) this.setParameters(data.params);
    }


    /**
     *
     * @param {Object} params
     */
    setParameters(params) {
        if(!params) return false;
        if (Object.keys(params).length === 0) return false;
        this.params = params;
        for (let parameter in params) {
            this.setValue(parameter, params[parameter]);
        }
        return true;
    }
}

module.exports = IntentRPC;