'use strict';
let Event = require('./event');

/**
 * Occurs when Request got from 3rd party provider
 */
class RequestEvent extends Event {
    constructor(data = {}){
        super('onRequest', data);
    }
}

module.exports = RequestEvent;