'use strict';

class Card {

    constructor() {
        this.title = undefined;
        this.text = undefined;
        this.content = undefined;
    }

    setTitle(title) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    }

    setText(text) {
        this.text = text;
    }

    getText() {
        return this.text;
    }
}


module.exports = Card;