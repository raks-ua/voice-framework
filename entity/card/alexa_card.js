'use strict';

let Card = require('./card');

const ALEXA_CARD_TYPE_SIMPLE = 'Simple';
const ALEXA_CARD_TYPE_STANDARD = 'Standard';
const ALEXA_CARD_TYPE_LINK_ACCOUNT = 'LinkAccount';

let types = [ALEXA_CARD_TYPE_SIMPLE, ALEXA_CARD_TYPE_STANDARD, ALEXA_CARD_TYPE_LINK_ACCOUNT];

class AlexaCard extends Card {

    constructor(type) {
        super();
        if (types.indexOf(type) === -1) throw 'Type must be from ' + types.join(', ');
        this.type = type;
        this.content = undefined;
        this.images = {
            small: undefined,
            big: undefined
        };
    }

    setTitle(title){
        if(this.isLinking()) throw 'Title not for ' + ALEXA_CARD_TYPE_LINK_ACCOUNT;
        super.setTitle(title);
    }

    setContent(content){
        if(!this.isSimple()) throw 'Content only for ' + ALEXA_CARD_TYPE_SIMPLE;
        this.content = content;
    }

    getContent(){
        return this.content;
    }

    setText(text){
        if(!this.isStandard()) throw 'Text only for ' + ALEXA_CARD_TYPE_STANDARD;
        super.setText(text);
    }

    getType() {
        return this.type;
    }

    setImages(small, big) {
        if(!this.isStandard()) throw 'Images only for ' + ALEXA_CARD_TYPE_STANDARD;
        let re = /^https/i;
        if(!small.match(re)) throw 'Small image must be https';
        if(!big.match(re)) throw 'Big image must be https';
        this.images.small = small;
        this.images.big = big;
    }

    getImages(){
        return this.images;
    }

    isLinking(){
        return this.type === ALEXA_CARD_TYPE_LINK_ACCOUNT;
    }

    isSimple(){
        return this.type === ALEXA_CARD_TYPE_SIMPLE;
    }

    isStandard(){
        return this.type === ALEXA_CARD_TYPE_STANDARD;
    }
}

module.exports = {
    AlexaCard,
    ALEXA_CARD_TYPE_SIMPLE,
    ALEXA_CARD_TYPE_STANDARD,
    ALEXA_CARD_TYPE_LINK_ACCOUNT
};
