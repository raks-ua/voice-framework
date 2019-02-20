'use strict';

const Response = require("../response");
const {Suggestions} = require('actions-on-google');

class ResponseGoogle extends Response {

    constructor(data = {}) {
        super(data);
	this.app = data.app;
	this.cc = data.cc;
    }

    setCb(cb){
	this.cb = cb;
    }

    setConv(conv){
	this.convData = conv;
    }


    /**
     *
     * @param message {Message}
     */
    ask(message) {
        let reprompt = message.getMessageReprompt('ssml');
        let msg = message.getMessage('ssml');
        msg = msg.replace(/<speak>/ig, '');
        msg = msg.replace(/<\/speak>/ig, '');

        this.convData.conv.ask(msg);
/*
        if(reprompt) {
            reprompt = reprompt.replace(/<speak>/ig, '');
            reprompt = reprompt.replace(/<\/speak>/ig, '');
	    this.response.reprompt(reprompt);
        }
*/
        super.ask(message);
    }

    /**
     *
     * @param message {Message}
     */
    tell(message) {
        let msg = message.getMessage('ssml');
        msg = msg.replace(/<speak>/ig, '');
        msg = msg.replace(/<\/speak>/ig, '');
        this.convData.conv.close(msg);
        super.tell(message);
    }



    setResultCallback(callback) {
        this.resultCallback = callback;
    }

    /**
     * Calling when need to call APP LIB, eg alexa.execute
     * @returns {Promise<any>}
     */
    process(appHandler, googleRequest) {
	this.cc();
        return super.process(appHandler, googleRequest);
    }

    sendSuccess() {
	this.cb();
        super.sendSuccess();
    }

    sendError(error) {
	this.cb();
        super.sendError(error);
    }

    setSuggestionChips(chips){
	this.suggestionChips = chips;
	this.convData.conv.ask(new Suggestions(chips));
    }

    setCompletePurchase(purchase){
	this.completePurchase = purchase;
	//console.log('[PURCHASE]', purchase);
	this.convData.conv.ask(purchase);
    }

    getResponse(){

    }

}
module.exports = ResponseGoogle;
