'use strict';
let Event = require('./event');

/**
 * Occurs when app starting
 */
class InitEvent extends Event {
    constructor(data = {}){
        super('onInit', data);
    }
}

module.exports = InitEvent;