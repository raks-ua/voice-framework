'use strict';

const Intent = require("../intent");

class IntentCustom extends Intent {

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
    setSlots(slots ={}) {
        if (Object.keys(slots).length === 0) return false;
        this.slots = slots;
        for (let slot in slots) {
            this.setValue(slots[slot].name, slots[slot].value);
        }
    }
}

module.exports = IntentCustom;