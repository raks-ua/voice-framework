'use strict';

class Event {

    /**
     *
     * @param name {String}
     * @param data {Object}
     */
    constructor(name, data = {}){
        this.name = name;
        this.data = data;
    }

    /**
     *
     * @returns {String|*}
     */
    getName(){
        return this.name;
    }

    /**
     *
     * @returns {Object|*}
     */
    getData(){
        return this.data;
    }
}

module.exports = Event;