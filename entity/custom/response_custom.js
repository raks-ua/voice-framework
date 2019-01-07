'use strict';

const Response = require("../response");

class ResponseCustom extends Response {


    constructor(data) {
        super(data);
        this.speech = data.speech;
        this.reprompt = data.reprompt;
        this.directive = data.directive || [];
        this.card = data.card;
    }

    /**
     *
     * @param {string} speech
     * @param {string} reprompt
     */
    setSpeech(speech, reprompt) {
        super.setSpeech(speech);
        this.reprompt = reprompt;
    }

    /**
     *
     * @param {Object} directive
     */
    addDirective(directive) {
        this.directive.push(directive);
    }

    /**
     *
     * @param {Object} card
     */
    setCard(card) {
        this.card = card;
    }
}
module.exports = ResponseCustom;
