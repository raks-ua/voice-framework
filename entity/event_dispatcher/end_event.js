'use strict';
let Event = require('./event');

/**
 * Sending when app processed request and will be "closed"
 */
class EndEvent extends Event {
    constructor(data = {}) {
        super('onEnd', data);
    }
}

module.exports = EndEvent;