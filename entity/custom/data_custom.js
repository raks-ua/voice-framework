'use strict';

const Data = require("../data");

class DataCustom extends Data {


    constructor(data = '') {
        super(data);
        this.event = data.event;
        this.context = data.context;
    }

    /**
     *
     * @param {*} event
     */
    setEvent(event) {
        this.event = event;
    }

    /**
     *
     * @param {*} event
     */
    getEvent(event) {
        return this.event;
    }

    /**
     *
     * @param {Object} context
     */
    setContext(context) {
        this.context = context;
    }

    /**
     *
     * @param {Object} context
     */
    getContext(context) {
        return this.context;
    }


}

module.exports = DataCustom;