'use strict';

class Intent {

    /**
     * @param {Object} data
     */
    constructor(data) {
        this.name = data.name;
        this.type = data.type;
        this.values = data.values || {};
    }

    /**
     *
     * @returns {string} name
     */
    getName() {
        return this.name;
    }

    /**
     *
     * @param {string} name
     */
    setName(name) {
        this.name = name;
    }

    /**
     *
     * @returns {string} type
     */
    getType() {
        return this.type;
    }


    /**
     *
     * @param type {string} button, speech, audio
     */
    setType(type) {
        this.type = type;
    }

    /**
     *
     * @param subType {string} playback
     */
    setSubType(subType) {
        this.type = type;
    }


    /**
     * @param {string} key
     * @param {*} def
     * @returns {*} value
     */
    getValue(key, def) {
        if (this.values[key]) {
            return this.values[key];
        }

        return def;

    }

    /**
     *
     * @param key
     * @param value
     */

    setValue(key, value) {
        this.values[key] = value;
    }
}

module.exports = Intent;