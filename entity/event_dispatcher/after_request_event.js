'use strict';
let Event = require('./event');

/**
 * Occurs when Request sent
 */
class AfterRequestEvent extends Event {
    constructor(data = {}){
        super('onAfterRequest', data);
    }
}

module.exports = AfterRequestEvent;