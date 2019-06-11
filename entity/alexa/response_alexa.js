'use strict';

const Response = require("../response");
const Message = require("../message/message");
const CardAlexa = require("./card_alexa");

const AlexaAudioPlayDirective = require("./directive/alexa-audio-play-directive");
const AlexaAudioClearDirective = require("./directive/alexa-audio-clear-directive");
const AudioStopDirective = require("../directive/audio-stop-directive");

let self;

/**

https://ask-sdk-for-nodejs.readthedocs.io/en/latest/Building-Response.html
*/
class ResponseAlexa extends Response {

    constructor(data) {
        super(data);
        self = this;
        this.skill = data.skill;
        this.cc = data.cc;

        this.response = undefined;
        this.request = data.request;
    }

    setResponseBuilder(responseBuilder){
        this.response = responseBuilder;
    }


    setCb(cb){
	this.cb = cb;
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
//            this.response.listen(reprompt);
    	    this.response.reprompt(reprompt);
	    
        }
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
        this.response.speak(msg);
        super.tell(message);
    }

    /**
     *
     * @param {Object} directive
     */
    addDirective(directive) {
        this.directives.push(directive);

	if(directive instanceof AlexaAudioPlayDirective){
	    this.response.addAudioPlayerPlayDirective(directive.getBehaviour(), directive.getUrl(), directive.getToken(), directive.getOffsetInMilliseconds() || 0, directive.getExpectedPreviousToken() || null, directive.getMetadata());
	}else if(directive instanceof AudioStopDirective){
	    this.response.addAudioPlayerStopDirective();
	}else if(directive instanceof AlexaAudioClearDirective){
	    this.response.addAudioPlayerClearQueueDirective(directive.getClearBehavior());
	}else{
	    this.response.addDirective(directive.getData());
	}
    }

    /**
     *
     * @param {CardAlexa} card
     */
    setCard(card) {
        if(card.isLinking()){
            this.response.withLinkAccountCard();
        }else if(card.isStandard()){
            let images = card.getImages();
	    this.response.withStandardCard(card.getTitle(), card.getText(), images.small, images.big);
        }else if(card.isSimple()){	    
	    this.response.withSimpleCard(card.getTitle(), card.getContent());
        }
        super.setCard(card);
    }

    sendSuccess() {
	this.cb();
        super.sendSuccess();
    }

    sendError(error) {
	this.cb();
        super.sendError(error);
    }

    /**
     *
     * @returns {Promise<any>}
     */
    process(appHandler, request){
        this.cc();
        return super.process();
    }

    shouldEndSession(should) {
	this.response.withShouldEndSession(should);
        super.shouldEndSession(should);
    }

    withCanFulfillIntent(data){
	this.response.withCanFulfillIntent(data);
    }

    getResponse(){
	return this.response.getResponse();
    }
}

module.exports = ResponseAlexa;