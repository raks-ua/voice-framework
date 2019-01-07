'use strict';

const config = require('config');
const request = require('request');
let self;

class Device {

    constructor(data){
        self = this;
        this.data = data;
        console.log('DEVICE', data);
    }

    getDisplay(){

    }
}

module.exports = Device;