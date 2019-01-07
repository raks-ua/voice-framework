'use strict';

class Error {
    constructor(data = {}){
        this.message = data.message;
        this.data = {
            class: this.constructor.name.replace('RPC', ''),
            data: {}
        };
    }

    setMessage(message) {
        this.message = message;
    }

    setData(key, value){
        this.data.data[key] = value;
    }

    getMessage(){
        return this.message || 'Internal error';
    }

    getData(){
        return this.data;
    }
}

module.exports = Error;
