'use strict';

let Card = require('../card/card');

const ALEXA_CARD_TYPE_SIMPLE = 'Simple';
const ALEXA_CARD_TYPE_STANDARD = 'Standard';
const ALEXA_CARD_TYPE_LINK_ACCOUNT = 'LinkAccount';

let types = [ALEXA_CARD_TYPE_SIMPLE, ALEXA_CARD_TYPE_STANDARD, ALEXA_CARD_TYPE_LINK_ACCOUNT];

//TODO: move types checking to alexa_card_model
class CardAlexa extends Card {

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
        super.setTitle(title);
    }

    setContent(content){
        this.content = content;
    }

    getContent(){
        return this.content;
    }

    setText(text){
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

    /**
     *
     * @param card {CardAlexa}
     * @returns {boolean}
     */
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

module.exports = CardAlexa;
