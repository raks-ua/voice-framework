'use strict';

const Intent = require("../intent");

class IntentAlexa extends Intent {

    /**
     *
     * @param {Object} data
     */
    constructor(data = '') {
        super(data);
        if (data.slots) this.setSlots(data.slots);
    }


    /**
     *
     * @param {Object} slots
     */
    setSlots(slots) {
        if(!slots) return false;
        if (Object.keys(slots).length === 0) return false;
        this.slots = slots;
        for (let slot in slots) {
            this.setValue(slots[slot].name, slots[slot].value);
        }
        return true;
    }
}

module.exports = IntentAlexa;