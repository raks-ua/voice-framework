'use strict';
let Event = require('./event');

/**
 * Occurs when before request filled
 */
class BeforeRequestEvent extends Event {
    constructor(data = {}){
        super('onBeforeRequest', data);
    }
}

module.exports = BeforeRequestEvent;