'use strict';

const Response = require("../response");
const Message = require("../message/message");
const {AlexaCard} = require("../card/alexa_card");

let self;

class ResponseAlexa extends Response {

    constructor(data) {
        super(data);
        self = this;
        this.alexa = data.alexa;
        this.response = undefined;
        this.request = data.request;
    }

    setResponseBuilder(responseBuilder){
        this.response = responseBuilder;
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

        this.response.speak(msg);
        if(reprompt) {
            reprompt = reprompt.replace(/<speak>/ig, '');
            reprompt = reprompt.replace(/<\/speak>/ig, '');
            this.response.listen(reprompt);
        }
        super.ask(message);
    }

    /**
     *
     * @param message {Message}
     */
    tell(message) {
        this.response.speak(message.getMessage());
        super.tell(message);
    }

    /**
     *
     * @param {Object} directive
     */
    addDirective(directive) {
        this.directives.push(directive);
    }

    /**
     *
     * @param {AlexaCard} card
     */
    setCard(card) {
        if(card.isLinking()){
            this.response.linkAccountCard();
        }else if(card.isStandard()){
            let images = card.getImages();
            this.response.cardRenderer(card.getTitle(), card.getText(), {
                smallImageUrl: images.small,
                largeImageUrl: images.big
            });
        }else if(card.isSimple()){
            this.response.cardRenderer(card.getTitle(), card.getContent());
        }
        super.setCard(card);
    }

    sendSuccess() {
        this.alexa.emit(':responseReady');
        super.sendSuccess();
    }

    sendError(error) {
        this.alexa.emit(':responseReady');
        super.sendError(error);
    }

    /**
     *
     * @returns {Promise<any>}
     */
    process(appHandler, request){
        this.alexa.execute();
        return super.process();
    }

    shouldEndSession(should) {
        this.response._responseObject.response.shouldEndSession = should;
        super.shouldEndSession(should);
    }

    playAudio(userId, url){
        let token = userId + '_' + (new Date()).getTime();
        this.response.audioPlayerPlay('REPLACE_ALL', url, token, undefined, 0);
    }

    stopAudio(){
        this.response.audioPlayerStop();
    }

    getResponse(){
        return this.response._responseObject;
    }
}

module.exports = ResponseAlexa;