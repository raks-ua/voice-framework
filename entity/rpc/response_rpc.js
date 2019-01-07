'use strict';

const Response = require("../response");
const ErrorRPC = require("./error_rpc");
const Message = require("../message/message");
const uuid = require('uuid').v4;

let self;

class ResponseRPC extends Response {

    constructor(data) {
        super(data);
    }

    setResultCallback(callback) {
        this.resultCallback = callback;
    }

    /**
     * Calling when need to call APP LIB, eg alexa.execute
     * @returns {Promise<any>}
     */
    process(appHandler, rpcRequest) {
        return super.process(appHandler, rpcRequest);
    }

    sendSuccess() {
        this.resultCallback(undefined, this.getRequest());
        super.sendSuccess();
    }

    /**
     *
     * @param error {ErrorRPC}
     */
    sendError(error) {
        //console.log(this.resultCallback);
        this.resultCallback(error, this.getRequest());
        super.sendError(error);
    }

    /**
     *
     * @returns {ErrorRPC}
     */
    getError() {
        return this.error;
    }

    getResponse() {
        let code = 200;
        let message;
        let messageData;
        let data;
        let error = this.getError();
        if (error) {
            code = error.getCode();
            message = error.getMessage();
            messageData = error.getData();
        } else if(this.message) {
            data = this.message.getData();
        }
        let res = {
            code,
            message,
            messageData,
            data,
            name: this.getRequest().getIntent().getName(),
            requestId: this.getRequest().getRequestId()
        };
        //console.log('RES', res);
        return res;
    }
}

module.exports = ResponseRPC;