'use strict';

let CardAlexa = require('../entity/alexa/card_alexa.js');
const ALEXA_CARD_TYPE_SIMPLE = 'Simple';
const ALEXA_CARD_TYPE_STANDARD = 'Standard';
const ALEXA_CARD_TYPE_LINK_ACCOUNT = 'LinkAccount';

let types = [ALEXA_CARD_TYPE_SIMPLE, ALEXA_CARD_TYPE_STANDARD, ALEXA_CARD_TYPE_LINK_ACCOUNT];


class AlexaCardModel {

    constructor() {

    }

    /**
     *
     * @param card {CardAlexa}
     * @returns {boolean}
     */
    isLinking(card){
        return card.type === ALEXA_CARD_TYPE_LINK_ACCOUNT;
    }

    isSimple(){
        return card.type === ALEXA_CARD_TYPE_SIMPLE;
    }

    isStandard(){
        return card.type === ALEXA_CARD_TYPE_STANDARD;
    }
}

module.exports = AlexaCardModel;