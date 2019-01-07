'use strict';

const Intent = require("../intent");

class IntentGoogle extends Intent {

    /**
     *
     * @param {Object} data
     */
    constructor(data = '') {
        super(data);
        if (data.parameters) this.setParameters(data.parameters);
        this.queryText = '';
    }


    /**
     *
     * @param {Object} parameters
     */
    setParameters(parameters) {
        if (Object.keys(parameters).length === 0) return false;
        this.parameters = parameters;
        for (let parameter in parameters) {
            this.setValue(parameter, parameters[parameter]);
        }
    }

    setQueryText(queryText){
        this.queryText = queryText;
    }

    getQueryText(){
        return this.queryText;
    }
}

module.exports = IntentGoogle;