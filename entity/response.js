'use strict';
const Message = require("./message/message");
const Card = require("./card/card");

class Response {

    /**
     * @param {Object} data
     */
    constructor(data) {
        this.data = data.data;
        this.message = undefined;
        this.processResolve = undefined;
        this.processReject = undefined;
        this.error = undefined;
        this.success = false;
        this.endSession = false;
        this.card = undefined;
        this.request = data.request;
        this.directives = [];
    }

    /**
     *
     * @param message {Message}
     */
    ask(message) {
        this.message = message;
        this.shouldEndSession(false);
    }

    /**
     * Finishing session after message
     * @param message {Message}
     */
    tell(message) {
        this.message = message;
        this.shouldEndSession(true);
    }

    /**
     *
     * @param card {Card}
     */
    setCard(card){
        this.card = card;
    }

    /**
     *
     * @returns {Object} data
     */
    getData() {
        return this.data;
    }

    sendSuccess() {
        this.success = true;
    }

    sendError(error) {
        this.error = error;
        this.success = false;
    }

    isSuccess(){
        return this.success;
    }

    /**
     * Calling when need to call APP LIB, eg alexa.execute
     * @returns {Promise<any>}
     */
    process(appHandler, request) {
        return this.initProcess();
    }

    /**
     *
     * @returns {Promise<any>}
     */
    initProcess() {
        let p = new Promise((res, rej) => {
            this.processResolve = res;
            this.processReject = rej;
        });
        return p;
    }

    shouldEndSession(should) {
        this.endSession = should;
    }

    getRequest(){
        return this.request;
    }

    getMessage(){
        return this.message;
    }

    getResponse(){
        throw 'Please set getResponse in your Response Class';
    }

    addDirective(directive){
        this.directives.push(directive);
    }
}

module.exports = Response;