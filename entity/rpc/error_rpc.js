'use strict';

const Error = require("../error");

class ErrorRPC extends Error {

    constructor(data = {}) {
        super(data);
        this.code = data.code;
    }

    setCode(code){
        this.code = code;
    }

    getCode(){
        return this.code || 500;
    }
}

module.exports = ErrorRPC;
