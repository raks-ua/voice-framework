let AudioPlayDirective = require('./../../directive/audio-play-directive');
const uuid = require('uuid').v4;

class AlexaAudioPlayDirective extends AudioPlayDirective {
    constructor(data){
	super();
	this.token = data.token || uuid();
	this.url = data.url;
	this.metadata = data.metadata;
	this.offsetInMilliseconds = data.offsetInMilliseconds || 0;
	this.expectedPreviousToken = data.expectedPreviousToken;
    }

    setToken(token){
	this.token = token;
    }

    getToken(){
	return this.token;
    }

    getMetadata(){
	return this.metadata;
    }


    setExpectedPreviousToken(token){
	this.expectedPreviousToken = token;
    }

    getExpectedPreviousToken(){
	return this.expectedPreviousToken;
    }

    setOffsetInMilliseconds(offset){
	this.offsetInMilliseconds = offset;
    }

    getOffsetInMilliseconds(){
	return this.offsetInMilliseconds;
    }

}

module.exports = AlexaAudioPlayDirective;

