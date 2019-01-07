'use strict';
let Event = require('./event');

/**
 * Occurs when Request got from 3rd party provider
 */
class ErrorEvent extends Event {
    constructor(data = {}){
        super('onError', data);
    }

    /**
     * @returns {Event}
     */
    getEvent(){
        return this.getData().event;
    }

    getError(){
        return this.getData().err;
    }
}

module.exports = ErrorEvent;