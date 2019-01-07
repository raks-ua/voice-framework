'use strict';

const Device = require("../device");

class DeviceClova extends Device {

    getDisplay(){
        return this.data.display;
    }
}

module.exports = DeviceClova;